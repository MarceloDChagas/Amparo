import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import promise from "eslint-plugin-promise";
import security from "eslint-plugin-security";
import simpleImportSort from "eslint-plugin-simple-import-sort";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  security.configs.recommended,
  promise.configs["flat/recommended"],
  eslintPluginPrettierRecommended,
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    settings: {
      next: {
        rootDir: "frontend/",
      },
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      // Fire-and-forget UI promises that already handle errors with .catch()
      // may end in .finally() for cleanup; the trailing .then in such chains
      // need not return a value.
      "promise/catch-or-return": ["error", { allowFinally: true }],
      "promise/always-return": ["error", { ignoreLastCallback: true }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
