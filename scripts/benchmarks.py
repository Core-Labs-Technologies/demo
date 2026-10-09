"""Per-task benchmark results used on the page, with routing statistics.

Every number here is copied from a primary source (cited inline) and was
cross-checked against the source's printed averages. "Routed" means each task
is sent to the model with the highest published success on that task; it is an
upper bound unless stated as held-out.

Usage: .venv/bin/python scripts/benchmarks.py  -> data/benchmarks.json
"""
import json
import statistics

ROBOCASA_TASKS = [
    "Close Double Door", "Close Drawer", "Close Single Door", "Coffee Press Button",
    "Coffee Serve Mug", "Coffee Setup Mug", "Open Double Door", "Open Drawer",
    "Open Single Door", "PnP Cab → Counter", "PnP Counter → Cab", "PnP Counter → Microwave",
    "PnP Counter → Sink", "PnP Counter → Stove", "PnP Microwave → Counter",
    "PnP Sink → Counter", "PnP Stove → Counter", "Turn Off Microwave",
    "Turn Off Sink Faucet", "Turn Off Stove", "Turn On Microwave", "Turn On Sink Faucet",
    "Turn On Stove", "Turn Sink Spout",
]

# RoboCasa skill groups as defined in the RoboCasa paper (Nasiriany et al., RSS 2024).
ROBOCASA_SKILL = {
    "Close Double Door": "Doors", "Close Single Door": "Doors", "Open Double Door": "Doors",
    "Open Single Door": "Doors", "Close Drawer": "Drawers", "Open Drawer": "Drawers",
    "Coffee Press Button": "Buttons", "Turn On Microwave": "Buttons", "Turn Off Microwave": "Buttons",
    "Coffee Serve Mug": "Insertion", "Coffee Setup Mug": "Insertion",
    "Turn On Stove": "Knobs", "Turn Off Stove": "Knobs",
    "Turn On Sink Faucet": "Levers", "Turn Off Sink Faucet": "Levers", "Turn Sink Spout": "Levers",
}

# Kim et al., "Contrastive Representation Regularization for Vision-Language-Action
# Models" (RS-CL), ICML 2026, arXiv 2510.01711v4. Table 13 (GR00T N1.5, L_FM column)
# and Table 14 (π0, π0-FAST reproduced). Same MimicGen data per regime, 1,200 trials
# per model (50 per task).
ROBOCASA = {
    30: {
        "GR00T N1.5": [44, 96, 98, 70, 64, 28, 80, 46, 64, 28, 36, 30, 28, 38, 24, 40, 22, 62, 72, 10, 44, 60, 34, 38],
        "π0": [68, 94, 94, 66, 80, 20, 92, 44, 58, 14, 32, 26, 32, 14, 16, 22, 10, 64, 72, 14, 58, 80, 26, 50],
        "π0-FAST": [44, 84, 84, 20, 44, 2, 26, 36, 44, 12, 8, 10, 2, 10, 4, 12, 18, 68, 48, 0, 52, 40, 12, 36],
    },
    100: {
        "GR00T N1.5": [86, 96, 94, 82, 72, 34, 92, 58, 58, 42, 54, 36, 66, 60, 44, 52, 60, 86, 86, 14, 58, 90, 56, 58],
        "π0": [86, 94, 98, 80, 66, 32, 90, 56, 64, 22, 44, 30, 44, 32, 20, 24, 46, 84, 86, 10, 82, 82, 68, 68],
        "π0-FAST": [84, 96, 90, 82, 66, 34, 68, 58, 70, 22, 58, 32, 46, 50, 38, 56, 62, 98, 76, 18, 68, 66, 52, 54],
    },
    300: {
        "GR00T N1.5": [80, 96, 98, 90, 58, 24, 82, 74, 78, 54, 54, 32, 58, 66, 50, 60, 68, 94, 92, 28, 44, 86, 32, 78],
        "π0": [86, 96, 96, 88, 64, 38, 84, 62, 70, 18, 46, 18, 58, 60, 24, 66, 44, 96, 94, 22, 70, 86, 42, 72],
        "π0-FAST": [78, 94, 72, 90, 68, 38, 78, 68, 66, 30, 48, 20, 56, 64, 46, 62, 60, 96, 94, 22, 88, 74, 38, 76],
    },
}
ROBOCASA_PRINTED = {30: [48.2, 47.8, 29.8], 100: [63.9, 58.7, 60.2], 300: [65.7, 62.5, 63.6]}

# NVIDIA Isaac-GR00T, examples/SimplerEnv README (N1.6 and N1.7 columns, 100 trials
# per task; N1.6 spoon 101) and the N1.5 release README (300 trials per task).
# WidowX / Bridge tasks; ** = tasks added in NVIDIA's SimplerEnv fork.
SIMPLER_TASKS = ["Spoon on towel", "Carrot on plate", "Eggplant in basket", "Stack cube",
                 "Eggplant in sink**", "Close drawer**", "Open drawer**"]
SIMPLER = {
    "GR00T N1.5": [82, 72, 63, 54, 21, 65, 84],
    "GR00T N1.6": [55.4, 46, 89, 5, 33, 73, 95],
    "GR00T N1.7": [78, 58, 53, 48, 2, 97, 100],
}
SIMPLER_PRINTED = [63, 56.6, 62.3]

# RoboTwin 2.0 (Chen et al., arXiv 2506.18088v2), Table 10. 50 dual-arm tasks,
# 50 clean demos per task, 100 rollouts per task per setting, benchmark authors' runs.
ROBOTWIN_EASY = {
    "RDT": [81,77,3,0,61,80,64,74,45,90,23,72,25,8,43,2,59,37,2,42,3,1,10,5,50,19,6,78,4,56,12,1,33,1,15,15,35,41,21,33,50,4,84,74,2,21,51,76,1,35],
    "π0": [90,43,19,7,63,44,83,96,45,98,11,84,58,21,53,0,85,80,27,57,31,27,17,23,80,41,34,88,15,37,20,7,16,10,36,35,28,62,54,68,68,18,99,97,17,42,66,91,3,27],
    "ACT": [97,56,1,0,32,58,68,94,42,85,7,88,22,0,36,0,56,86,7,31,1,0,6,7,49,1,16,72,9,61,1,0,15,0,1,2,5,31,27,15,1,2,63,74,0,25,48,82,2,5],
    "DP": [97,42,0,1,61,54,49,98,10,53,8,39,39,1,47,1,49,5,6,24,2,13,14,11,72,18,40,41,8,37,3,0,15,1,22,13,23,6,22,42,13,9,59,65,0,7,63,61,2,36],
    "DP3": [99,72,3,2,77,90,85,98,70,100,17,97,70,41,68,12,82,61,52,60,46,49,26,19,72,67,48,86,13,65,36,4,65,15,60,44,58,69,60,72,74,31,100,98,1,24,57,83,18,46],
}
ROBOTWIN_HARD = {
    "RDT": [75,37,0,0,12,9,32,43,14,31,16,9,12,0,11,0,32,20,0,13,1,1,2,1,27,6,5,17,4,7,2,0,17,0,5,6,7,24,4,18,5,1,51,45,0,2,17,30,0,15],
    "π0": [56,21,5,1,11,3,24,80,8,13,3,36,21,1,22,2,46,50,6,12,1,6,4,1,4,5,2,45,0,11,10,1,2,0,11,7,6,29,13,18,15,1,51,60,0,1,24,41,4,23],
    "ACT": [23,3,0,0,4,3,1,25,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,6,1,0,0,0,4,10,0,0,0,0,0,2],
    "DP": [0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,8,0,0,0,0,0,1],
    "DP3": [3,8,0,0,14,0,53,2,0,3,1,0,6,0,3,0,7,22,1,1,2,0,1,0,18,2,3,1,0,1,1,1,0,0,0,2,2,3,21,1,1,1,25,19,0,0,5,6,0,8],
}

# OpenVLA-OFT (Kim et al., RSS 2025, arXiv 2502.19645), Table I, wrist + proprio block.
# LIBERO suites: Spatial, Object, Goal, Long. 500 trials per suite.
LIBERO = {"OpenVLA-OFT": [97.6, 98.4, 97.9, 94.5], "π0": [96.8, 98.8, 95.8, 85.2], "π0-FAST": [96.4, 96.8, 88.6, 60.2]}


def mean(v):
    return statistics.mean(v)


def route_stats(models):
    names = list(models)
    n = len(next(iter(models.values())))
    avgs = {m: mean(models[m]) for m in names}
    best = max(avgs, key=avgs.get)
    routed = [max(models[m][i] for m in names) for i in range(n)]
    winners = []
    for i in range(n):
        top = max(models[m][i] for m in names)
        winners.append([m for m in names if models[m][i] == top])
    sole = {m: sum(1 for w in winners if w == [m]) for m in names}
    shared = {m: sum(1 for w in winners if m in w) for m in names}
    return {
        "averages": avgs,
        "best_single": best,
        "best_single_avg": avgs[best],
        "routed_avg": mean(routed),
        "gain": mean(routed) - avgs[best],
        "routed": routed,
        "winners": winners,
        "sole_wins": sole,
        "wins_incl_ties": shared,
    }


def held_out(train, test):
    """Pick a model per task from one set of runs; score it on another, independent set."""
    names = list(train)
    n = len(next(iter(train.values())))
    pick = [max(names, key=lambda m: (train[m][i], -names.index(m))) for i in range(n)]
    default = max(names, key=lambda m: mean(train[m]))
    routed = mean(test[pick[i]][i] for i in range(n))
    single = mean(test[default])
    best_test = max(mean(test[m]) for m in names)
    return {"picks": pick, "default": default, "routed_on_test": routed,
            "default_on_test": single, "best_single_on_test": best_test,
            "gain_vs_default": routed - single, "gain_vs_best_test": routed - best_test}


def main():
    out = {"robocasa": {"tasks": ROBOCASA_TASKS, "skill": ROBOCASA_SKILL, "regimes": {}}}
    for demos, models in ROBOCASA.items():
        s = route_stats(models)
        for m, printed in zip(models, ROBOCASA_PRINTED[demos]):
            assert abs(s["averages"][m] - printed) < 0.06, (demos, m, s["averages"][m], printed)
        out["robocasa"]["regimes"][demos] = {"models": models, **s}
    out["robocasa"]["held_out"] = {
        f"{a}->{b}": held_out(ROBOCASA[a], ROBOCASA[b])
        for a, b in [(100, 300), (300, 100), (30, 100), (100, 30), (30, 300), (300, 30)]
    }

    s = route_stats(SIMPLER)
    for m, printed in zip(SIMPLER, SIMPLER_PRINTED):
        assert abs(s["averages"][m] - printed) < 0.2, (m, s["averages"][m], printed)
    out["simpler"] = {"tasks": SIMPLER_TASKS, "models": SIMPLER, **s,
                      "original4": route_stats({m: v[:4] for m, v in SIMPLER.items()})}

    out["robotwin"] = {"easy": route_stats(ROBOTWIN_EASY), "hard": route_stats(ROBOTWIN_HARD)}
    for k in ("easy", "hard"):
        out["robotwin"][k].pop("routed")
        out["robotwin"][k].pop("winners")
    out["libero"] = route_stats(LIBERO)

    json.dump(out, open("data/benchmarks.json", "w"), indent=1, ensure_ascii=False)

    for d, r in out["robocasa"]["regimes"].items():
        print(f"RoboCasa {d:>3} demos: best {r['best_single']} {r['best_single_avg']:.2f} -> routed {r['routed_avg']:.2f} (+{r['gain']:.2f}); sole wins {r['sole_wins']}")
    for k, h in out["robocasa"]["held_out"].items():
        print(f"  held-out {k}: routed {h['routed_on_test']:.2f} vs default {h['default']} {h['default_on_test']:.2f} ({h['gain_vs_default']:+.2f}); vs best-on-test {h['best_single_on_test']:.2f} ({h['gain_vs_best_test']:+.2f})")
    r = out["simpler"]
    print(f"SimplerEnv GR00T family 7 tasks: best {r['best_single']} {r['best_single_avg']:.2f} -> {r['routed_avg']:.2f} (+{r['gain']:.2f}); {r['sole_wins']}")
    r = out["simpler"]["original4"]
    print(f"  original 4: best {r['best_single']} {r['best_single_avg']:.2f} -> {r['routed_avg']:.2f} (+{r['gain']:.2f})")
    for k in ("easy", "hard"):
        r = out["robotwin"][k]
        print(f"RoboTwin {k}: best {r['best_single']} {r['best_single_avg']:.2f} -> {r['routed_avg']:.2f} (+{r['gain']:.2f}) {r['sole_wins']}")
    r = out["libero"]
    print(f"LIBERO: best {r['best_single']} {r['best_single_avg']:.2f} -> {r['routed_avg']:.2f} (+{r['gain']:.2f})")


if __name__ == "__main__":
    main()
