import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // `const { a, ...rest } = x` es el idioma para omitir campos
      "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
      // Reglas del React Compiler: señalan patrones válidos de esta app
      // (leer localStorage tras montar, Date.now() en manejadores). Se
      // mantienen como aviso hasta migrarlas.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
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
