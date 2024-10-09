import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json" assert { type: "json" };
import copy from "rollup-plugin-copy";
import path from "path";

export default {
  input: "index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      sourcemap: true,
    },
    {
      file: "dist/index.esm.js",
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    copy({
      targets: [
        {
          src: "node_modules/@davidcks/r3f-vrm/build/*",
          dest: "static/aic-runtime-deps/vrm-deps/",
        },
        {
          src: "node_modules/piper-wasm/build/worker/*",
          dest: "static/aic-runtime-deps/piper-deps/",
        },
        {
          src: "node_modules/piper-wasm/build/piper_phonemize.data",
          dest: "static/aic-runtime-deps/piper-deps/",
        },
        {
          src: "node_modules/piper-wasm/build/piper_phonemize.js",
          dest: "static/aic-runtime-deps/piper-deps/",
        },
        {
          src: "node_modules/piper-wasm/build/piper_phonemize.wasm",
          dest: "static/aic-runtime-deps/piper-deps/",
        },
        {
          src: "node_modules/piper-wasm/espeak-ng/espeak-ng-data/*",
          dest: "static/aic-runtime-deps/piper-deps/espeak-ng-data/",
        },
      ],
    }),
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx"], // Handle .tsx files
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
    terser(),
  ],
  external: Object.keys(pkg.peerDependencies),
};
