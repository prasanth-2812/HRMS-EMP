module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'react-app',
    'react-app/jest',
  ],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    // Add any specific rules here
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
