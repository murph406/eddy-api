import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        require: 'readonly',
        exports: 'writable',
        module: 'writable',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
        process: 'readonly'
      }
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal'],
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc' }
      }]
    }
  }
]