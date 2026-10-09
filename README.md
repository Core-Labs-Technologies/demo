# Demo

Core Labs Technologies demo project: the investor page and the launch film.

## What is here

| Path | What it is |
| --- | --- |
| `index.html` | The built page Vercel serves. Generated, do not edit by hand. |
| `site/index.html` | Page source. Edit this, then run `python3 scripts/build.py`. |
| `clips/` | Page media: the launch film and the real-robot matchup clips. |
| `video/` | The launch film, built with [Remotion](https://www.remotion.dev). Source in `video/src/Launch.tsx`. |
| `data/` | Benchmark and RoboArena routing results used on the page. |
| `scripts/` | Build, analysis and footage scripts. |

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

After editing `site/index.html`, rebuild the root page:

```bash
python3 scripts/build.py
```

## Deploy

Hosted on Vercel. Deploy from the repo root with:

```bash
vercel --prod
```

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
