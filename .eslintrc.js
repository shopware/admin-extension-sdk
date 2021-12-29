module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'no-prototype-builtins': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'comma',
        requireLast: true,
      },
      singleline: {
        delimiter: 'comma',
        requireLast: false,
      },
    }],
    "capitalized-comments": [
      "error",
      "always",
      {
          "ignorePattern": "pragma|ignored",
          "ignoreInlineComments": true
      },
    ],
    semi: [
      "error",
      "always",
    ],
    'no-console': [
      "error",
      {
        allow: [
          'warn',
          'error',
        ],
      },
    ],
  }
};