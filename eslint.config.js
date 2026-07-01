const nx = require('@nx/eslint-plugin');
const tseslint = require('typescript-eslint');

module.exports = tseslint.config(
  {
    plugins: {
      '@nx': nx,
      '@typescript-eslint': tseslint.plugin,
    },
  },
  {
    files: ['**/*.ts'],
    extends: [...nx.configs['flat/angular']],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: 'scope:app',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:calendar'],
            },
            {
              sourceTag: 'scope:calendar',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:calendar'],
            },
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:ui',
                'type:data-access',
                'type:utils',
              ],
            },
            {
              sourceTag: 'type:data-access',
              onlyDependOnLibsWithTags: ['type:utils'],
            },
            {
              sourceTag: 'type:utils',
              onlyDependOnLibsWithTags: ['type:utils'],
            },
            {
              sourceTag: 'type:ui',
              onlyDependOnLibsWithTags: ['type:utils'],
            },
          ],
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'sc', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'sc', style: 'kebab-case' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [...nx.configs['flat/angular-template']],
    rules: {},
  },
);
