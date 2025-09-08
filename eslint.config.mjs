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
      // Allow unescaped entities in JSX for better readability
      "react/no-unescaped-entities": "off",
      // Allow any types for faster development
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused variables for development
      "@typescript-eslint/no-unused-vars": "warn",
      // Allow require imports
      "@typescript-eslint/no-require-imports": "off",
      // Allow prefer-const warnings
      "prefer-const": "warn",
      // Allow missing dependencies in useEffect
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
