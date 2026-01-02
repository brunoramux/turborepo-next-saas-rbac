import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'

// Flat config for Node backend with TypeScript + Prettier
/** @type {import('typescript-eslint').Config} */
export default tseslint.config(
  // ESLint core recommendations
  eslint.configs.recommended,
  // TypeScript recommendations
  ...tseslint.configs.recommended,
  // Prettier integration (runs Prettier via ESLint and disables conflicting rules)
  prettier,
  // Project-specific tweaks
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['dist', 'build', 'node_modules'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true,
      },
    },
    rules: {},
  }
)
