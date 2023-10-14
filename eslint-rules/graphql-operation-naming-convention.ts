import {
  requireGraphQLSchemaFromContext,
  type GraphQLESLintRule,
} from "@graphql-eslint/eslint-plugin";
import { GraphQLESTreeNode } from "@graphql-eslint/eslint-plugin/cjs/estree-converter/types";
import { NameNode } from "graphql";
import * as path from "path";

const RULE_ID = "graphql-operation-naming-convention";

const rule: GraphQLESLintRule<[], true> = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require names to follow specified conventions.",
      category: ["Operations"],
    },
    hasSuggestions: true,
    schema: [],
  },
  create(context) {
    requireGraphQLSchemaFromContext(RULE_ID, context);

    const report = (
      node: GraphQLESTreeNode<NameNode, true>,
      message: string,
      suggestedNames: string[],
    ) => {
      context.report({
        node,
        message: `${message}`,
        suggest: suggestedNames.map((suggestedName) => ({
          desc: `Rename to \`${suggestedName}\``,
          fix: (fixer) => fixer.replaceText(node as any, suggestedName),
        })),
      });
    };

    const parsedPath = path.parse(context.physicalFilename);
    const dirname = parsedPath.dir.split("/").pop() ?? "";
    const moduleName = parsedPath.name === "index" ? dirname : parsedPath.name;
    const upperCamelModuleName =
      moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

    return {
      OperationDefinition(node) {
        if (!node.name) {
          context.report({
            node,
            message: "OperationDefinition should have a name",
          });
          return;
        }

        const operationName = node.name.value;

        const expectedPrefix = upperCamelModuleName;
        const expectedSuffix =
          node.operation.charAt(0).toUpperCase() + node.operation.slice(1);
        const expectedOperationName = new RegExp(
          `^${expectedPrefix}.*${expectedSuffix}$`,
        );

        if (!expectedOperationName.test(operationName)) {
          report(
            node.name,
            `Operation "${operationName}" should have prefix "${expectedPrefix}" and suffix "${expectedSuffix}"`,
            [`${expectedPrefix}${expectedSuffix}`],
          );
        }
      },
      FragmentDefinition(node) {
        const fragmentName = node.name.value;
        const gqlType = node.typeInfo().gqlType?.toString();
        if (!gqlType) {
          context.report({
            node,
            message: "FragmentDefinition should have a type",
          });
          return;
        }

        const expectedPrefix = upperCamelModuleName;
        const expectedSuffix = `_${gqlType}`;
        const expectedFragmentName = new RegExp(
          `^${expectedPrefix}.*${expectedSuffix}$`,
        );

        if (!expectedFragmentName.test(fragmentName)) {
          report(
            node.name,
            `Fragment "${fragmentName}" should have prefix "${expectedPrefix}" and suffix "${expectedSuffix}"`,
            [`${expectedPrefix}${expectedSuffix}`],
          );
        }
      },
    };
  },
};

module.exports = rule;
export default rule;
