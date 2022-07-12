module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  rules: {
    semi: 'off',
    '@typescript-eslint/semi': ['error']
  }
};
