import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/mui.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2020",
 external: [
  "react",
  "react-dom",
  "@mui/material",
  "@mui/system",
  "@emotion/react",
  "@emotion/styled",
],
});
