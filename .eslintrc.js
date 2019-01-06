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
  },
  env: { browser: true },
}
