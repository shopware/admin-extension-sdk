module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  plugins: [
    '@typescript-eslint',
    'import',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    'no-prototype-builtins': 'off',
    'comma-dangle': 'off',
    'no-irregular-whitespace': 'error',
    'no-multiple-empty-lines': ['error', { max: 1}],
    '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/consistent-type-imports': ['error'],
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
    'capitalized-comments': [
      'error',
      'always',
      {
          'ignorePattern': 'pragma|ignored',
          'ignoreInlineComments': true,
      },
    ],
    semi: [
      'error',
      'always',
    ],
    'no-console': [
      'error',
      {
        allow: [
          'warn',
          'error',
        ],
      },
    ],
    'indent': [
      'error',
      2,
    ],
    'no-debugger': 'error',
    'no-unreachable': 'error',
    'consistent-return': 'error',
    camelcase: 'error',
    curly: 'error',
    eqeqeq: 'error',
    'multiline-comment-style': [
      'error',
      'starred-block',
    ],
    'no-iterator': 'error',
    'import/no-cycle': [
      2,
      {
        maxDepth: 1,
      },
    ],
    quotes: ['error', 'single'],
    'eol-last': ['error', 'always'],
  },
};
