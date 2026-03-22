//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    rules: {
      'import/no-cycle': 'off',
      'import/order': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/require-await': 'off',
      'pnpm/json-enforce-catalog': 'off',
    },
  },
  // Block server-only imports in client/component files.
  // Only *.functions.ts, *.server.ts, and middleware files may import these.
  {
    files: ['src/**/*.tsx', 'src/**/*.ts'],
    ignores: [
      'src/**/*.functions.ts',
      'src/**/*.server.ts',
      'src/middlewares/**',
      'src/lib/auth.ts',
      'src/features/**/**.functions.ts',
      'src/db/**',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['#/db', '#/db/*'],
              message:
                'Do not import DB directly in client code. Use server functions in *.functions.ts files instead.',
            },
            {
              group: ['drizzle-orm', 'drizzle-orm/*'],
              message:
                'drizzle-orm is server-only. Use server functions in *.functions.ts files instead.',
            },
            {
              group: ['pg', 'pg/*'],
              message:
                'pg is server-only. Use server functions in *.functions.ts files instead.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: ['eslint.config.js', 'prettier.config.js'],
  },
]

