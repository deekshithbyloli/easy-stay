module.exports = {
  extends: [
    'next',
    'prettier',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
  rules: {
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': [
      'error',
      {
        args: 'after-used',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        vars: 'all'
      }
    ],
    '@typescript-eslint/no-unused-vars': 'error',
    // to enforce using type for object type definitions, can be type or interface
    '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    'prefer-const': 'error',
    'react-hooks/exhaustive-deps': 'warn'
  }
};
