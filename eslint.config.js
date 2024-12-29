import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'
import stylisticJsx from '@stylistic/eslint-plugin-jsx'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config({ ignores: ['dist'] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ['**/*.{js,ts,tsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            '@stylistic/js': stylisticJs,
            '@stylistic/jsx': stylisticJsx
        },
        rules: {
            "function-paren-newline": ["error", {"minItems": 3}],
            "@stylistic/js/indent": ["error", 4],
            "@stylistic/jsx/jsx-one-expression-per-line": [1, { "allow": "literal" }],
            "@stylistic/js/comma-spacing": ["error", { "before": false, "after": true }],
            ...reactHooks.configs.recommended.rules,
            'react-refresh/only-export-components': [
                'warn',
                { allowConstantExport: true },
            ],
        },
    },)

