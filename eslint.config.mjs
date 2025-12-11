import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "react/jsx-no-target-blank": "off",
      "react-hooks/set-state-in-effect": "warn", // Allow setState in effects with setTimeout
      "react-hooks/preserve-manual-memoization": "warn", // Allow manual memoization
      "@typescript-eslint/no-explicit-any": "warn", // Allow any in type declarations
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
    },
  },
];

export default eslintConfig;

