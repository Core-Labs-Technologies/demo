# Demo

Core Labs Technologies demo project: the investor page and the launch film.

## What is here

| Path | What it is |
| --- | --- |
| `index.html`, `src/` | The page: React, [Motion](https://motion.dev) and Tailwind, built with Vite. Sections live in `src/components/`. |
| `src/data/bench.ts` | Per-task benchmark numbers the page charts (same values as `scripts/benchmarks.py`). |
| `src/assets/team/` | Team photos. |
| `clips/` | Page media: the launch film and the real-robot matchup clips. Copied into the build as `/clips/`. |
| `video/` | The launch film, built with [Remotion](https://www.remotion.dev). Source in `video/src/Launch.tsx`. |
| `data/` | Benchmark and RoboArena routing results. |
| `scripts/` | Analysis and footage scripts. |

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the production site to `dist/`.

## Deploy

Hosted on Vercel and connected to this repo: every push to `main` deploys to production. `vercel.json` sets the Vite build.

## Launch film

The DROID robot footage (about 600 MB) is not committed. Fetch and encode it once, then render:

```bash
python3 scripts/fetch_footage.py
cd video && npm install && npm run render
```

`npm run studio` opens Remotion Studio for live editing. The rendered film lands in `video/out/`; copy a web-sized version to `clips/launch-film.mp4` for the page.

## Data sources

- Real-robot footage and head-to-head results: [RoboArena](https://huggingface.co/datasets/RoboArena/DataDump_07-17-2026) (MIT) and [DROID](https://droid-dataset.github.io) teleoperated demonstrations (CC BY 4.0).
- Benchmarks: SimplerEnv results published by NVIDIA (Isaac-GR00T), RoboCasa per-task results from Kim et al., ICML 2026 (arXiv 2510.01711), RoboTwin 2.0 Table 10 (arXiv 2506.18088).
- `scripts/roboarena_routing.py` and `scripts/benchmarks.py` reproduce the numbers in `data/`. The RoboArena script expects the dataset metadata in `raw/`, which is not committed.
