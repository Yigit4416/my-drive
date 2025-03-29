// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
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

export const folders = createTable(
  "folders",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    route: text("route").notNull(),
    parentId: integer("parent_id"),
    type: varchar("type", { length: 50 }).notNull(),
    size: integer("size").default(0).notNull(),
    userId: varchar("userId", { length: 250 }).notNull(),
  },
  (table) => {
    return {
      userIdIndex: index("folders_user_id_ndx").on(table.userId),
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
    userId: varchar("userId", { length: 250 }).notNull(),
  },
  (table) => {
    return {
      userIdIndex: index("files_user_id_ndx").on(table.userId),
      idIndex: index("files_id_idx").on(table.id),
      folderIdIndex: index("files_folder_id_idx").on(table.folderId),
    };
  },
);
