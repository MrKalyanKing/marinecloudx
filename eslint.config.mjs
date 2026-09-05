import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Synced copy of the shared contract — edit packages/contracts instead.
    "src/contracts/**",
    // Design reference assets — not application source.
    "Website redesign_ Glass UI, Marine Core/**",
  ]),
]);

export default eslintConfig;
