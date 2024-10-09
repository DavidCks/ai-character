import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json" assert { type: "json" };
import copy from "rollup-plugin-copy";
import path from "path";

export default {
  input: "src/worker/llama-worker.ts",
  output: {
    file: "dist/llama-worker.js", // Temporary location
    format: "iife", // IIFE format for web workers
    name: "LlamaWorker",
    sourcemap: true,
  },
  plugins: [
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    commonjs(),
    typescript({
      tsconfig: "./tsconfig.build.json",
      exclude: ["**/__tests__/**"],
      extensions: [".js", ".jsx", ".ts", ".tsx"],
    }),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      extensions: [".js", ".jsx", ".ts", ".tsx"], // Babel should handle these too
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript",
      ],
    }),
    copy({
      targets: [
        {
          src: "dist/llama-worker.js", // Move the output file
          dest: "static/aic-runtime-deps/llama-deps/",
        },
      ],
      hook: "writeBundle", // Copy after the bundle is written
    }),
  ],
};
