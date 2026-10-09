import { MotionConfig } from "motion/react";
import { Hero, Product } from "./components/Hero";
import { Evidence, Film } from "./components/Media";
import { Benchmarks } from "./components/Benchmarks";
import { Footer, Method, Team } from "./components/Closing";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main>
        <Hero />
        <Film />
        <Team />
        <Evidence />
        <Benchmarks />
        <Product />
        <Method />
      </main>
      <Footer />
    </MotionConfig>
  );
}
