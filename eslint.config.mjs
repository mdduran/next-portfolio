import { defineConfig, globalIgnores } from "eslint/config";
import nextConfig from "eslint-config-next";
import nextTypescript from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import react from "eslint-plugin-react";
import globals from "globals";

export default defineConfig([
    globalIgnores([".next/**", "node_modules/**", "next-env.d.ts", "scripts/**"]),
    ...nextConfig,
    ...nextTypescript,
    prettierConfig,
    {
        // eslint-plugin-react's "detect" relies on an API removed in ESLint 10
        settings: {
            react: { version: "19.2" },
        },

        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },

        rules: {
            ...react.configs.flat.recommended.rules,

            "react-hooks/rules-of-hooks": "error",

            "react/no-unknown-property": [1, {
                ignore: [
                    "position",
                    "rotation",
                    "dispose",
                    "castShadow",
                    "receiveShadow",
                    "geometry",
                    "material",
                    "map",
                    "intensity",
                    "wireframe",
                    "args",
                    "attach",
                    "object",
                    "toneMapped",
                ],
            }],

            "react-hooks/exhaustive-deps": "off",
            "react/react-in-jsx-scope": "off",
            "react/jsx-props-no-spreading": "off",
            "arrow-body-style": "off",
            "react/forbid-prop-types": "off",
            "react/jsx-filename-extension": "off",
            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": "error",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",

            "react/function-component-definition": ["error", {
                namedComponents: ["function-declaration", "arrow-function"],
                unnamedComponents: "arrow-function",
            }],

            "import/extensions": ["error", "ignorePackages", {
                js: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
            }],
        },
    },
]);
