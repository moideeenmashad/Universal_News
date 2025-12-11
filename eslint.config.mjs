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
      "react-hooks/set-state-in-effect": "off", // Allow setState in effects (needed for reset logic)
      "react-hooks/preserve-manual-memoization": "warn", // Allow manual memoization
      "react-hooks/refs": "off", // Allow ref access in render (we use useEffect instead)
      "@typescript-eslint/no-explicit-any": "off", // Allow any in utility functions like debounce
      "@typescript-eslint/no-unused-vars": ["warn", { 
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      }],
    },
  },
];

export default eslintConfig;

