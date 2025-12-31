import eslint from '@eslint/js'
import prettier from 'eslint-plugin-prettier/recommended'

// Flat config for plain JavaScript + Prettier (no TypeScript)
/** @type {import('eslint').Linter.Config[]} */
export default [
  eslint.configs.recommended,
  prettier,
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: ['dist', 'build', 'node_modules'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
  },
]
