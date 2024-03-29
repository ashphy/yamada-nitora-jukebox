module.exports = {
  globals: {
    __PATH_PREFIX__: true
  },
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  plugins: ['react'],
  settings: {
    react: {
      version: 'detect'
    }
  },
  ignorePatterns: ['graphql-types.ts', 'gatsby-browser.tsx', '.eslintrc.js'],
  rules: {
    semi: 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      { allowAny: true }
    ],
    '@typescript-eslint/member-delimiter-style': ['error', {}]
  }
};
