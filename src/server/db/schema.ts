// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  index,
  integer,
  pgTableCreator,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `my-drive_${name}`);
/*
export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);
*/

export const folders = createTable(
  "folders",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    route: text("route").notNull(),
    // cascade for parentId gives type error probably because we try to create that function before it executed and it gives us type error
    //look into it later again or just handle in server side logic.
    parentId: integer("parent_id"),
    type: varchar("type", { length: 50 }).notNull(),
    size: integer("size").default(0).notNull(),
  },
  (table) => {
    return {
      idIndex: index("folders_id_idx").on(table.id),
      parentIdIndex: index("folders_parent_id_idx").on(table.parentId),
    };
  },
);

export const files = createTable(
  "files",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    folderId: integer("folder_id")
      .references(() => folders.id, { onDelete: "cascade" })
      .notNull(),
    route: text("route").notNull(),
    size: integer("size").default(0).notNull(),
  },
  (table) => {
    return {
      idIndex: index("files_id_idx").on(table.id),
      folderIdIndex: index("files_folder_id_idx").on(table.folderId),
    };
  },
);
