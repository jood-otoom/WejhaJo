import eslint from "@eslint/js";
import next from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import hooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
  eslint.configs.recommended,
  tseslint.configs.recommended,
  next.configs["core-web-vitals"],
  { ...hooks.configs.flat.recommended, files: ["src/**/*.{ts,tsx}"] },
]);
