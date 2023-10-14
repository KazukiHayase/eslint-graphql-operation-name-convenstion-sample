const esLintPluginGraphQL = require("@graphql-eslint/eslint-plugin");
const rulesDirPlugin = require("eslint-plugin-rulesdir");
rulesDirPlugin.RULES_DIR = "eslint-rules/dist";

module.exports = [
  {
    files: ["src/**/*.graphql"],
    languageOptions: {
      parser: esLintPluginGraphQL,
      parserOptions: {
        schema: "./schema.graphql",
      },
    },
    plugins: {
      customRule: rulesDirPlugin,
    },
    rules: {
      "customRule/graphql-operation-naming-convention": "error",
    },
  },
];
