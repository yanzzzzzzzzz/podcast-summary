import vuetify from 'eslint-config-vuetify';

export default [
  vuetify(),
  {
    plugins: ['prettier'],
    extends: ['plugin:prettier/recommended'],
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
