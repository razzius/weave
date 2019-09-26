module.exports = {
  parser: 'babel-eslint',
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/react',
  ],
  plugins: ['flowtype'],
  rules: {
    semi: 0,
    'react/jsx-filename-extension': 0,
    'react/state-in-constructor': 0,
    'react/jsx-curly-newline': 0,
    'react/jsx-fragments': 0,
    'react/static-property-placement': 0,
  },
  env: { browser: true },
}
