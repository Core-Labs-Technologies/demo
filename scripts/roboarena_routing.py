"""Held-out routing experiment on RoboArena real-world evaluations.

Data: RoboArena/DataDump_07-17-2026 (Hugging Face, MIT). 3,883 evaluation
sessions; in each session two or more policies attempt the same instruction
on the same DROID Franka setup, scored blind by the evaluator.

Router: maps the instruction's skill category to the policy with the highest
mean task progress on the training split. Baseline: the single policy with
the highest overall mean on the same training split. Both are scored on
held-out sessions. Repeated over many random 50/50 splits.

Usage: .venv/bin/python scripts/roboarena_routing.py
"""
import json
import random
import re
import statistics
from collections import Counter, defaultdict

SRC = "raw/ra_sessions.json"
OUT = "data/roboarena_routing.json"

POLICIES = {
    "pi05_droid": "π0.5-DROID",
    "pi0_fast_droid": "π0-FAST-DROID",
    "pi0_droid": "π0-DROID",
    "paligemma_fast_specialist_droid": "PaliGemma-FAST-specialist",
    "paligemma_fast_droid": "PaliGemma-FAST",
    "paligemma_vq_droid": "PaliGemma-VQ",
    "paligemma_diffusion_droid": "PaliGemma-Diffusion",
}

# First matching rule wins. Order matters: multi-step before single verbs.
RULES = [
    ("Multi-step", r"\bthen\b|\band (?:then )?(?:close|open|put|place)\b.*\b(?:drawer|lid|door)\b"),
    ("Open / close", r"^(?:open|close|shut|pull out|pull open|push (?:in|close|shut)|slide (?:open|close))\b|\b(?:open|close) the (?:drawer|door|lid|oven|microwave|cabinet|fridge|laptop|box)"),
    ("Reorient", r"^(?:rotate|rotated|flip|stand|upright|turn (?!on|off)\w+|turn the (?!.*\b(?:on|off)\b))|upside down|\bupright\b"),
    ("Cloth & deformables", r"^(?:fold|unfold|cover|uncover|drape|untie|tear|hang|lay)\b|\b(?:towel|cloth|tissue|napkin|rope|shirt|sock)s?\b"),
    ("Tool use & pouring", r"^(?:wipe|clean|erase|draw|write|stir|cut|pour|scoop|sweep|wash|scrub|use|squeeze|dispense)\b"),
    ("Push, press & touch", r"^(?:press|push|touch|poke|knock|topple|depress|turn on|turn off|switch|squash|tap)\b"),
    ("Stacking", r"^(?:stack|unstack)\b|\bstack\b"),
    ("Grasp & lift", r"^(?:pick up|grasp|grab|lift|hold|pick)\b(?!.*\b(?:in|into|on|onto|to|inside|onto|in the)\b)"),
    ("Pick & place", r"^(?:put|place|move|take|remove|throw|pick|grasp|grab|drop|bring|give|transfer|insert|deliver|empty|dump|sort|arrange|hide|separate|serve|feed|slot|load)\b"),
]


def categorize(instr: str) -> str:
    s = re.sub(r"\s+", " ", (instr or "").lower().strip())
    for name, pat in RULES:
        if re.search(pat, s):
            return name
    return "Other"


def load():
    rows = json.load(open(SRC))
    eps = []  # (sid, category, policy, progress, success)
    sessions = {}
    for r in rows:
        cat = categorize(r["instr"])
        pols = {}
        for label, p in r["pols"].items():
            if p["name"] in POLICIES and p["ps"] is not None:
                pols[label] = p
                eps.append((r["sid"], cat, p["name"], float(p["ps"]), int(p["bin"] or 0)))
        sessions[r["sid"]] = {"cat": cat, "pref": r["pref"], "pols": pols, "instr": r["instr"], "loc": r["loc"]}
    return eps, sessions


def table(eps):
    by = defaultdict(list)
    for sid, cat, pol, ps, b in eps:
        by[(cat, pol)].append((ps, b))
        by[("All", pol)].append((ps, b))
    out = {}
    for (cat, pol), v in by.items():
        out.setdefault(cat, {})[pol] = {
            "n": len(v),
            "progress": statistics.mean(x[0] for x in v),
            "success": statistics.mean(x[1] for x in v),
        }
    return out


def fit(eps, metric, min_n):
    t = table(eps)
    overall = max(t["All"], key=lambda p: t["All"][p][metric])
    route = {}
    for cat, d in t.items():
        if cat == "All":
            continue
        ok = {p: s for p, s in d.items() if s["n"] >= min_n}
        route[cat] = max(ok, key=lambda p: ok[p][metric]) if ok else overall
    return overall, route


def score(eps, policy_for_cat, metric):
    """Category-weighted held-out mean for a routing function."""
    idx = 0 if metric == "progress" else 1
    by = defaultdict(list)
    cats = Counter()
    seen = set()
    for sid, cat, pol, ps, b in eps:
        if sid not in seen:
            cats[cat] += 1
            seen.add(sid)
        by[(cat, pol)].append((ps, b)[idx])
    total, wsum = 0.0, 0
    for cat, w in cats.items():
        v = by.get((cat, policy_for_cat(cat)))
        if not v:
            continue
        total += w * statistics.mean(v)
        wsum += w
    return total / wsum


def experiment(eps, metric="progress", splits=1000, min_n=25, seed=7):
    rng = random.Random(seed)
    sids = sorted({e[0] for e in eps})
    gains, routed_s, single_s = [], [], []
    for _ in range(splits):
        rng.shuffle(sids)
        train = set(sids[: len(sids) // 2])
        tr = [e for e in eps if e[0] in train]
        te = [e for e in eps if e[0] not in train]
        overall, route = fit(tr, metric, min_n)
        r = score(te, lambda c: route.get(c, overall), metric)
        s = score(te, lambda c: overall, metric)
        routed_s.append(r)
        single_s.append(s)
        gains.append(r - s)
    gains.sort()
    q = lambda a, p: sorted(a)[int(p * (len(a) - 1))]
    return {
        "metric": metric,
        "splits": splits,
        "routed_mean": statistics.mean(routed_s),
        "single_mean": statistics.mean(single_s),
        "gain_mean": statistics.mean(gains),
        "gain_p05": q(gains, 0.05),
        "gain_p95": q(gains, 0.95),
        "share_positive": sum(g > 0 for g in gains) / len(gains),
    }


def head_to_head(sessions, route, default):
    """Sessions where the routed pick and the default policy ran side by side
    on the same task, the routed pick differs from the default, and the
    evaluator stated a preference (blind A/B)."""
    win = loss = tie = 0
    for s in sessions.values():
        pick = route.get(s["cat"], default)
        if pick == default:
            continue
        labels = {p["name"]: lab for lab, p in s["pols"].items()}
        if pick in labels and default in labels:
            pref = s["pref"]
            if pref == labels[pick]:
                win += 1
            elif pref == labels[default]:
                loss += 1
            elif pref == "TIE":
                tie += 1
    return {"routed_wins": win, "default_wins": loss, "ties": tie}


def main():
    eps, sessions = load()
    t = table(eps)
    overall, route = fit(eps, "progress", 25)
    cats = Counter(s["cat"] for s in sessions.values() if s["pols"])
    res = {
        "source": "RoboArena/DataDump_07-17-2026 (huggingface.co/datasets/RoboArena/DataDump_07-17-2026), MIT license",
        "policies": POLICIES,
        "n_sessions": sum(1 for s in sessions.values() if s["pols"]),
        "n_episodes": len(eps),
        "categories": dict(cats.most_common()),
        "table": t,
        "full_data_route": route,
        "full_data_best_single": overall,
        "experiment_progress": experiment(eps, "progress"),
        "experiment_success": experiment(eps, "success"),
        "head_to_head_full_data": head_to_head(sessions, route, overall),
    }
    json.dump(res, open(OUT, "w"), indent=1, ensure_ascii=False)
    print(json.dumps({k: v for k, v in res.items() if k != "table"}, indent=1, ensure_ascii=False))
    print()
    pols = list(POLICIES)
    print(f"{'category':22s} " + " ".join(f"{POLICIES[p][:10]:>10s}" for p in pols))
    for cat in ["All"] + [c for c, _ in cats.most_common()]:
        d = t.get(cat, {})
        print(f"{cat:22s} " + " ".join(
            f"{d[p]['progress']*100:6.1f}/{d[p]['n']:<3d}" if p in d else f"{'-':>10s}" for p in pols))


if __name__ == "__main__":
    main()
