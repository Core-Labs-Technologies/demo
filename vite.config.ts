import { cpSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Media stays in clips/ at the repo root. The dev server already serves it from
// there; on build, copy it next to the bundle so /clips/... resolves in production.
function copyClips(): Plugin {
  return {
    name: "copy-clips",
    apply: "build",
    closeBundle() {
      cpSync(resolve(__dirname, "clips"), resolve(__dirname, "dist/clips"), { recursive: true });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyClips()],
  publicDir: false,
});
