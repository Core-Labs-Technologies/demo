<p align="center">
  <img src=".github/assets/banner.svg" alt="Core Labs: Taking Robots from the Lab to Production Line" width="100%">
</p>

<p align="center">
  <a href="https://corelabsdemo.vercel.app"><img src="https://img.shields.io/badge/Live_demo-corelabsdemo.vercel.app-2453E8?style=for-the-badge" alt="Live demo"></a>
  <a href="mailto:hitarth2004@gmail.com,anandtejas455@gmail.com,vanshwahi786@gmail.com"><img src="https://img.shields.io/badge/Contact_us-email-0A1428?style=for-the-badge" alt="Contact us"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Motion-animations-FFF200?style=flat-square&logo=framer&logoColor=black" alt="Motion">
  <img src="https://img.shields.io/badge/Vercel-deployed-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
</p>

<br>

On standard benchmarks, routing beats the best single model **every time**:

<img src=".github/assets/results.svg" alt="Routing vs the best single model on SimplerEnv, RoboCasa and RoboTwin 2.0" width="100%">

## Team

<table align="center">
  <tr>
    <td align="center" width="300">
      <img src=".github/assets/team-tejas.png" width="120" alt="Tejas Anand"><br>
      <b>Tejas Anand</b><br>
      <sub>Applied research at NVIDIA<br>Patents in vision &amp; VLMs</sub>
    </td>
    <td align="center" width="300">
      <img src=".github/assets/team-hitarth.png" width="120" alt="Hitarth Khurana"><br>
      <b>Hitarth Khurana</b><br>
      <sub>Robotics at Boxbot<br>and Amazon</sub>
    </td>
    <td align="center" width="300">
      <img src=".github/assets/team-vansh.png" width="120" alt="Vansh Wahi"><br>
      <b>Vansh Wahi</b><br>
      <sub>Applied research at Google Gemini<br>Founding engineer, TensorStax (acq. Snowflake)</sub>
    </td>
  </tr>
</table>

<img src=".github/assets/previously.svg" alt="Previously at NVIDIA, Google Gemini, AWS, Snowflake and Boxbot" width="100%">

<br>

<details>
<summary><b>Run it locally</b></summary>

```bash
npm install
npm run dev
```

The site lives in `src/` (React, Motion, Tailwind, Vite) with media in `clips/`. Every push to `main` deploys to Vercel. The launch film is a [Remotion](https://www.remotion.dev) project in `video/`.

</details>

<details>
<summary><b>Methodology &amp; sources</b></summary>

Routed scores send each task to the model with the highest published success on it, so they are an upper bound on what a router picking from the same pool could reach. `scripts/benchmarks.py` reproduces every number and runs a held-out check on RoboCasa; `scripts/roboarena_routing.py` analyzes the real-robot sessions.

[RoboArena](https://huggingface.co/datasets/RoboArena/DataDump_07-17-2026) (MIT) · [DROID](https://droid-dataset.github.io) (CC BY 4.0) · SimplerEnv (NVIDIA Isaac-GR00T) · RoboCasa ([arXiv 2510.01711](https://arxiv.org/abs/2510.01711)) · RoboTwin 2.0 ([arXiv 2506.18088](https://arxiv.org/abs/2506.18088))

</details>

<br>

<p align="center"><sub>© 2026 Core Labs™</sub></p>
