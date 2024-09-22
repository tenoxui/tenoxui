import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import generouted from "@generouted/react-router/plugin";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    generouted({
      output: "./src/routes/router.ts"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@style": path.resolve(__dirname, "./src/styles"),
      "@styler": path.resolve(__dirname, "./src/utils/styler.ts")
    }
  }
});
