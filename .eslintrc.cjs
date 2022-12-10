module.exports = {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  // files: ['./src/**/*.ts'],
  // ignores: ['./src/public/**/*'],
  rules: {
    quotes: [2, "double", {"avoidEscape": true}]
  },
  root: true,
};