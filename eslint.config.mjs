import globals from "globals"; 
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["node_modules/**", "dist/**"], // Ignore these directories
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"], // Applies to JS and TS files
    languageOptions: {
      ecmaVersion: "latest", // Latest ECMAScript version
      sourceType: "module",  // Use ES module syntax
    },
    rules: {
      "no-unused-vars": "warn", // Warn about unused variables
      "semi": ["error", "always"], // Enforce semicolons
      "quotes": ["error", "double"], // Enforce double quotes
    },
  },
  {
    files: ["**/*.js"], // Applies only to JS files
    languageOptions: {
      sourceType: "commonjs", // Use CommonJS for JS files
    },
  },
  {
    languageOptions: {
      globals: globals.node, // Define global variables for Node.js
    },
  },
  pluginJs.configs.recommended, // ESLint recommended rules for JS
  ...tseslint.configs.recommended, // TypeScript ESLint recommended rules
];
