/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/next.js", "plugin:storybook/recommended"],
  parserOptions: {
    project: true,
  },
};
