"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eslint_plugin_1 = require("@graphql-eslint/eslint-plugin");
var path = require("path");
var RULE_ID = "graphql-operation-naming-convention";
var rule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require names to follow specified conventions.",
      category: ["Operations"],
    },
    hasSuggestions: true,
    schema: [],
  },
  create: function (context) {
    var _a;
    (0, eslint_plugin_1.requireGraphQLSchemaFromContext)(RULE_ID, context);
    var report = function (node, message, suggestedNames) {
      context.report({
        node: node,
        message: "".concat(message),
        suggest: suggestedNames.map(function (suggestedName) {
          return {
            desc: "Rename to `".concat(suggestedName, "`"),
            fix: function (fixer) {
              return fixer.replaceText(node, suggestedName);
            },
          };
        }),
      });
    };
    var parsedPath = path.parse(context.physicalFilename);
    var dirname =
      (_a = parsedPath.dir.split("/").pop()) !== null && _a !== void 0
        ? _a
        : "";
    var moduleName = parsedPath.name === "index" ? dirname : parsedPath.name;
    var upperCamelModuleName =
      moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
    return {
      OperationDefinition: function (node) {
        if (!node.name) {
          context.report({
            node: node,
            message: "OperationDefinition should have a name",
          });
          return;
        }
        var operationName = node.name.value;
        var expectedPrefix = upperCamelModuleName;
        var expectedSuffix =
          node.operation.charAt(0).toUpperCase() + node.operation.slice(1);
        var expectedOperationName = new RegExp(
          "^".concat(expectedPrefix, ".*").concat(expectedSuffix, "$"),
        );
        if (!expectedOperationName.test(operationName)) {
          report(
            node.name,
            'Operation "'
              .concat(operationName, '" should have prefix "')
              .concat(expectedPrefix, '" and suffix "')
              .concat(expectedSuffix, '"'),
            ["".concat(expectedPrefix).concat(expectedSuffix)],
          );
        }
      },
      FragmentDefinition: function (node) {
        var _a;
        var fragmentName = node.name.value;
        var gqlType =
          (_a = node.typeInfo().gqlType) === null || _a === void 0
            ? void 0
            : _a.toString();
        if (!gqlType) {
          context.report({
            node: node,
            message: "FragmentDefinition should have a type",
          });
          return;
        }
        var expectedPrefix = upperCamelModuleName;
        var expectedSuffix = "_".concat(gqlType);
        var expectedFragmentName = new RegExp(
          "^".concat(expectedPrefix, ".*").concat(expectedSuffix, "$"),
        );
        if (!expectedFragmentName.test(fragmentName)) {
          report(
            node.name,
            'Fragment "'
              .concat(fragmentName, '" should have prefix "')
              .concat(expectedPrefix, '" and suffix "')
              .concat(expectedSuffix, '"'),
            ["".concat(expectedPrefix).concat(expectedSuffix)],
          );
        }
      },
    };
  },
};
module.exports = rule;
exports.default = rule;
