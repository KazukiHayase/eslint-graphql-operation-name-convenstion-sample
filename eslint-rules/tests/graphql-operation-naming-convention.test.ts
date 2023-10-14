import { join } from "path";
import rule from "../graphql-operation-naming-convention";
import { GraphQLRuleTester } from "@graphql-eslint/eslint-plugin";

const TEST_SCHEMA = /* GraphQL */ `
  type Query {
    todos: [Todo!]!
  }

  type Todo {
    id: Int!
    text: String!
    done: Boolean!
  }
`;

const WITH_SCHEMA = {
  parserOptions: {
    schema: TEST_SCHEMA,
  },
};

const ruleTester = new GraphQLRuleTester();

ruleTester.runGraphQLTests("graphql-operation-naming-convention", rule, {
  valid: [
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoList.graphql"),
      code: "query TodoListQuery { todos { id } }",
    },
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoList/index.graphql"),
      code: "query TodoListQuery { todos { id } }",
    },
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoList.graphql"),
      code: "query TodoListComponentQuery { todos { id } }",
    },
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoItem.graphql"),
      code: "fragment TodoItem_Todo on Todo { id }",
    },
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoItem/index.graphql"),
      code: "fragment TodoItem_Todo on Todo { id }",
    },
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoItem.graphql"),
      code: "fragment TodoItemComponent_Todo on Todo { id }",
    },
  ],
  invalid: [
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoList.graphql"),
      code: "query TodoList { todos { id } }",
      errors: [
        {
          message: `Operation "TodoList" should have prefix "TodoList" and suffix "Query"`,
        },
      ],
    },
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoList.graphql"),
      code: "query TodosQuery { todos { id } }",
      errors: [
        {
          message: `Operation "TodosQuery" should have prefix "TodoList" and suffix "Query"`,
        },
      ],
    },
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoItem.graphql"),
      code: "fragment TodoItem on Todo { id }",
      errors: [
        {
          message: `Fragment "TodoItem" should have prefix "TodoItem" and suffix "_Todo"`,
        },
      ],
    },
    {
      ...WITH_SCHEMA,
      filename: join(__dirname, "TodoItem.graphql"),
      code: "fragment Todos_Todo on Todo { id }",
      errors: [
        {
          message: `Fragment "Todos_Todo" should have prefix "TodoItem" and suffix "_Todo"`,
        },
      ],
    },
  ],
});
