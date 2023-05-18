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
  rules: {
    semi: 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/comma-dangle': [
      'error',
      {
        enums: 'always-multiline',
        generics: 'never',
        tuples: 'always-multiline'
      }
    ],
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      { allowAny: true }
    ],
    '@typescript-eslint/member-delimiter-style': ['error', {}]
  }
};
