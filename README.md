# Core Labs · Deployment Harness for Robotics

**Taking robots from the lab to the production line.**

No single robot model wins every task. Core Labs runs each task on the one that does, inside the site's rules, with a record of every decision.

**Live demo: [corelabsdemo.vercel.app](https://corelabsdemo.vercel.app)**

---

## The idea

Robot models are improving fast, but no single model, vendor or release runs a whole site. Core Labs is the deployment harness between a site's work and the models that drive its robots. Every task runs through four stages:

| Stage | What it does |
| --- | --- |
| **Route** | Sends each task to the model with the best measured record on it, not the one that is best on average. |
| **Enforce** | Checks every action against the site's rules before the robot moves. |
| **Comply** | Keeps a signed trail of which model ran, what it proposed and what was allowed. |
| **Recover** | Turns every failure into a rule the whole fleet inherits. |

The router switches models only when the lead is statistically real. If no model is confident, the task goes to a human operator.

## Key results

**Real robots.** Across 3,883 blind evaluation sessions on real robot arms (RoboArena), the strongest model, π0.5 from Physical Intelligence, still loses 1 in 3. The demo shows three side-by-side matchups where the same robot gets the same instruction, π0.5 fails and a different model succeeds.

**Standard benchmarks.** Task-level routing applied to published per-task results beats the best single model on all three benchmarks:

| Benchmark | Tasks | Best single model | Its success | With routing | Improvement | Tasks won by another model |
| --- | ---: | --- | ---: | ---: | ---: | ---: |
| SimplerEnv (real-to-sim, WidowX) | 7 | GR00T N1.5 | 63.0% | 75.3% | +20% | 4 of 7 |
| RoboCasa (MuJoCo kitchen) | 24 | GR00T N1.5 | 65.7% | 69.7% | +6% | 9 of 24 |
| RoboTwin 2.0 (two-arm, randomized) | 50 | π0 | 16.3% | 19.7% | +21% | 18 of 50 |

Improvement is relative: (routed − best single) ÷ best single. See [Methodology](#methodology).

## Team

| | |
| --- | --- |
| **Tejas Anand** | Applied research at NVIDIA. Multiple patents in computer vision and vision-language models. |
| **Hitarth Khurana** | Robotics at Boxbot and Amazon. |
| **Vansh Wahi** | Applied research at Google Gemini. Founding engineer at TensorStax, acquired by Snowflake. |

To get in touch, use **Contact us** on the [demo site](https://corelabsdemo.vercel.app).

---

## Repository

| Path | What it is |
| --- | --- |
| `index.html`, `src/` | The demo site: React, [Motion](https://motion.dev) and Tailwind, built with Vite. Page sections live in `src/components/`. |
| `src/data/bench.ts` | Per-task benchmark numbers the site charts (same values as `scripts/benchmarks.py`). |
| `src/assets/team/` | Team photos. |
| `clips/` | Site media: the launch film and the real-robot matchup clips, served at `/clips/`. |
| `video/` | The launch film, built with [Remotion](https://www.remotion.dev). Source in `video/src/Launch.tsx`. |
| `data/` | Benchmark and RoboArena routing results. |
| `scripts/` | Analysis and footage scripts that produce `data/`. |

### Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the production site to `dist/`.

### Deploy

Hosted on Vercel and connected to this repository: every push to `main` deploys to production. `vercel.json` sets the Vite build.

### Launch film

The DROID robot footage (about 600 MB) is not committed. Fetch and encode it once, then render:

```bash
python3 scripts/fetch_footage.py
cd video && npm install && npm run render
```

`npm run studio` opens Remotion Studio for live editing. The rendered film lands in `video/out/`; copy a web-sized version to `clips/launch-film.mp4` for the site.

## Methodology

- **Benchmarks.** Every per-task number is copied from a primary source and cross-checked against that source's printed averages. "Routed" sends each task to the model with the highest published success on it, so these figures are an upper bound on what a router picking from the same pool could reach. `scripts/benchmarks.py` reproduces them and also runs a held-out check on RoboCasa.
- **Real robots.** `scripts/roboarena_routing.py` analyzes the RoboArena sessions: in each one, two or more policies attempt the same instruction on the same DROID Franka setup and are scored blind. It expects the dataset metadata in `raw/`, which is not committed.

## Data sources

- Real-robot footage and head-to-head results: [RoboArena](https://huggingface.co/datasets/RoboArena/DataDump_07-17-2026) (MIT) and [DROID](https://droid-dataset.github.io) teleoperated demonstrations (CC BY 4.0).
- SimplerEnv: results published by NVIDIA (Isaac-GR00T).
- RoboCasa: per-task results from Kim et al., ICML 2026 ([arXiv 2510.01711](https://arxiv.org/abs/2510.01711)).
- RoboTwin 2.0: Table 10, randomized-scene setting ([arXiv 2506.18088](https://arxiv.org/abs/2506.18088)).

---

© 2026 Core Labs™
