// import js from '@eslint/js';
// import globals from 'globals';
// import react from 'eslint-plugin-react';
// import reactHooks from 'eslint-plugin-react-hooks';
// import reactRefresh from 'eslint-plugin-react-refresh';
// import node from 'eslint-plugin-node';

// export default [
//   { ignores: ['dist', 'node_modules', 'data',] },
  
//   // Configuración para frontend (React)
//   {
//     files: ['**/*.{js,jsx}'],
//     languageOptions: {
//       ecmaVersion: 2022,
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         ecmaFeatures: { jsx: true },
//         sourceType: 'module',
//       },
//     },
//     settings: { react: { version: '18.3' } },
//     plugins: {
//       react,
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh,
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       ...react.configs.recommended.rules,
//       ...react.configs['jsx-runtime'].rules,
//       ...reactHooks.configs.recommended.rules,
//       'react/jsx-no-target-blank': 'off',
//       'react-refresh/only-export-components': [
//         'warn',
//         { allowConstantExport: true },
//       ],
//     },
//   },

//   // Configuración para backend (Node.js / Express)
//   {
//     files: ['server/**/*.{js,mjs}'], // Cambia el patrón según la estructura de tu proyecto
//     languageOptions: {
//       ecmaVersion: 2022,
//       globals: globals.node,
//       parserOptions: {
//         ecmaVersion: 'latest',
//         sourceType: 'module',
//       },
//     },
//     plugins: {
//       node,
//     },
//     rules: {
//       ...js.configs.recommended.rules,
//       'node/no-unsupported-features/es-syntax': 'off',
//       'node/no-unpublished-import': 'off',
//       'node/no-missing-import': [
//         'error',
//         {
//           tryExtensions: ['.js', '.mjs'],
//         },
//       ],
//       'node/no-extraneous-import': 'error',
//       'node/no-deprecated-api': 'warn',
//     },
//   },
// ];

import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist', 'node_modules', ] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
