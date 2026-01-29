import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tailwindCanonicalClasses from 'eslint-plugin-tailwind-canonical-classes';
import globals from 'globals';
import typescript from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
    js.configs.recommended,
    reactHooks.configs.flat.recommended,
    ...typescript.configs.recommended,
    {
        ...react.configs.flat.recommended,
        ...react.configs.flat['jsx-runtime'], // Required for React 17+
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unescaped-entities': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    importPlugin.flatConfigs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        settings: {
            'import/resolver': {
                typescript: true,
                node: true,
            },
        },
        plugins: {
            'tailwind-canonical-classes': tailwindCanonicalClasses,
        },
        rules: {
            'import/order': [
                'error',
                {
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                    ],
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'tailwind-canonical-classes/tailwind-canonical-classes': [
                'warn',
                {
                    cssPath: './resources/css/app.css',
                    calleeFunctions: [
                        'cn',
                        'clsx',
                        'cva',
                        'classNames',
                        'twMerge',
                    ],
                },
            ],
        },
    },
    {
        ...importPlugin.flatConfigs.typescript,
        files: ['**/*.{ts,tsx}'],
        rules: {
            ...importPlugin.flatConfigs.typescript.rules,
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {
                    prefer: 'type-imports',
                    fixStyle: 'separate-type-imports',
                },
            ],
        },
    },
    {
        ignores: [
            'vendor',
            'node_modules',
            'public',
            'bootstrap/ssr',
            'tailwind.config.js',
            'vite.config.ts',
            'strapi/dist/**',
            'strapi/types/generated/**',
        ],
    },
    prettier, // Turn off all rules that might conflict with Prettier
];
