module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: { ecmaVersion: 'latest' },
  rules: {
    'no-console': 'off',
    semi: ['error', 'never'],
    'object-curly-newline': ['error', { multiline: true }],
    'no-underscore-dangle': 'off',
  },
}
