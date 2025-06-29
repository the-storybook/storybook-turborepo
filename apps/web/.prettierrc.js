/** @type {import('prettier').Config} */
module.exports = {
  ...require('@repo/eslint-config/prettier-base'),
  tabWidth: 2,
  semi: true,
  singleQuote: true,
};
