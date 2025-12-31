import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'
import nextPlugin from '@next/eslint-plugin-next'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'

// Flat config for Next.js with TypeScript + React + Prettier
/** @type {import('typescript-eslint').Config} */
export default tseslint.config(
  // Core and TS recommendations
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  // Prettier integration
  prettier,
  // Next/React specifics
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['.next', 'out', 'node_modules'],
    plugins: {
      '@next/next': nextPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        projectService: true,
      },
    },
    rules: {
      // Next.js + Core Web Vitals
      ...nextPlugin.configs?.recommended?.rules,
      ...nextPlugin.configs?.['core-web-vitals']?.rules,
      // React rules
      ...reactPlugin.configs?.recommended?.rules,
      // React Hooks
      ...reactHooksPlugin.configs?.recommended?.rules,
    },
  }
)
