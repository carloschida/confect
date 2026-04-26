import { GenericId } from "@confect/core";
import { describe, expect, expectTypeOf, it } from "@effect/vitest";
import {
  defineTable,
  type GenericTableIndexes,
  type GenericTableSearchIndexes,
  type GenericTableVectorIndexes,
  type TableDefinition,
} from "convex/server";
import { v, type GenericValidator } from "convex/values";
import { Schema } from "effect";
import * as Table from "../src/Table";

describe("Table", () => {
  it("tableDefinition property should extend a generic Convex TableDefinition", () => {
    const confectNotesTableDefinition = Table.make(
      "notes",
      Schema.Struct({
        userId: Schema.optionalWith(GenericId.GenericId("users"), {
          exact: true,
        }),
        text: Schema.String.pipe(Schema.maxLength(100)),
        tag: Schema.optionalWith(Schema.String, { exact: true }),
        author: Schema.optionalWith(
          Schema.Struct({
            role: Schema.Literal("admin", "user"),
            name: Schema.String,
          }),
          { exact: true },
        ),
        embedding: Schema.optionalWith(Schema.Array(Schema.Number), {
          exact: true,
        }),
      }),
    )
      .index("by_text", ["text"])
      .index("by_role", ["author.role"])
      .searchIndex("text", {
        searchField: "text",
        filterFields: ["tag"],
      })
      .vectorIndex("embedding", {
        vectorField: "embedding",
        filterFields: ["author.name", "tag"],
        dimensions: 1536,
      }).tableDefinition;
    type ConfectNotesTableDefinition = typeof confectNotesTableDefinition;

    const convexNotesTableDefinition = defineTable({
      userId: v.optional(v.id("users")),
      text: v.string(),
      tag: v.optional(v.string()),
      author: v.optional(
        v.object({
          role: v.union(v.literal("admin"), v.literal("user")),
          name: v.string(),
        }),
      ),
      embedding: v.optional(v.array(v.number())),
    })
      .index("by_text", ["text"])
      .index("by_role", ["author.role"])
      .searchIndex("text", {
        searchField: "text",
        filterFields: ["tag"],
      })
      .vectorIndex("embedding", {
        vectorField: "embedding",
        filterFields: ["author.name", "tag"],
        dimensions: 1536,
      });
    type ConvexNotesTableDefinition = typeof convexNotesTableDefinition;

    expectTypeOf<ConfectNotesTableDefinition>().toExtend<
      TableDefinition<
        GenericValidator,
        GenericTableIndexes,
        GenericTableSearchIndexes,
        GenericTableVectorIndexes
      >
    >();
    expectTypeOf<ConfectNotesTableDefinition>().toEqualTypeOf<ConvexNotesTableDefinition>();
    expect(convexNotesTableDefinition).toStrictEqual(
      confectNotesTableDefinition,
    );
  });

  it("'name' as a field", () => {
    const confectTableTableDefinition = Table.make(
      "table2",
      Schema.Struct({
        name: Schema.String,
        description: Schema.optional(Schema.String),
        createdBy: Schema.optionalWith(GenericId.GenericId("users"), {
          exact: true,
        }),
        dummy: Schema.String,
      }),
    ).searchIndex("search_name", { searchField: "name" }).tableDefinition;
    type ConfectTable = typeof confectTableTableDefinition;

    const convexTableDefinition = defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      dummy: v.string(),
    }).searchIndex("search_name", { searchField: "name" });
    type ConvexTable = typeof convexTableDefinition;

    expectTypeOf<ConfectTable>().toEqualTypeOf<ConvexTable>();
    expect(convexTableDefinition).toStrictEqual(confectTableTableDefinition);
  });

  it("'name' as only required field", () => {
    const confectTableTableDefinition = Table.make(
      "table2",
      Schema.Struct({
        name: Schema.String,
        description: Schema.optional(Schema.String),
        createdBy: Schema.optionalWith(GenericId.GenericId("users"), {
          exact: true,
        }),
        // dummy: Schema.String,
      }),
    ).searchIndex("search_name", { searchField: "name" }).tableDefinition;
    type ConfectTable = typeof confectTableTableDefinition;

    const convexTableDefinition = defineTable({
      name: v.string(),
      description: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      // dummy: v.string(),
    }).searchIndex("search_name", { searchField: "name" });
    type ConvexTable = typeof convexTableDefinition;

    expectTypeOf<ConfectTable>().toEqualTypeOf<ConvexTable>();
    expect(convexTableDefinition).toStrictEqual(confectTableTableDefinition);
  });

  it("'title' as only required field", () => {
    const confectTableTableDefinition = Table.make(
      "table2",
      Schema.Struct({
        title: Schema.String,
        description: Schema.optional(Schema.String),
        createdBy: Schema.optionalWith(GenericId.GenericId("users"), {
          exact: true,
        }),
        // dummy: Schema.String,
      }),
    ).searchIndex("search_name", { searchField: "title" }).tableDefinition;
    type ConfectTable = typeof confectTableTableDefinition;

    const convexTableDefinition = defineTable({
      title: v.string(),
      description: v.optional(v.string()),
      createdBy: v.optional(v.id("users")),
      // dummy: v.string(),
    }).searchIndex("search_name", { searchField: "title" });
    type ConvexTable = typeof convexTableDefinition;

    expectTypeOf<ConfectTable>().toEqualTypeOf<ConvexTable>();
    expect(convexTableDefinition).toStrictEqual(confectTableTableDefinition);
  });
});
