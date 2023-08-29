module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    'airbnb',
    'prettier',
  ],
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  rules: {
    semi: 0,
    'react/jsx-filename-extension': 0,
    'react/state-in-constructor': 0,
    'react/jsx-curly-newline': 0,
    'react/jsx-fragments': 0,
    'react/static-property-placement': 0,

    // Want to be able to spread props in HOCs
    'react/jsx-props-no-spreading': 0,

    // Default ES function props are not considered so we disable the rule
    'react/require-default-props': 0,

    // Logs are useful
    'no-console': 0,

    // Not interested in writing types for all props
    'react/prop-types': 'off'
  },
  env: { browser: true },
}
