// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { pgTableCreator } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `gromp_${name}`);

export const products = createTable("product", (d) => ({
  id: d.serial("id").primaryKey(),
  name: d.text("name").notNull(),
  pictureUrl: d.text("picture_url"),
}));

export const productsRelations = relations(products, ({ many }) => ({
  records: many(records),
}));

export const stores = createTable("stores", (d) => ({
  id: d.serial("id").primaryKey(),
  name: d.text("name").notNull(),
}));

export const storeRelations = relations(stores, ({ many }) => ({
  records: many(records),
}));

export const records = createTable("records", (d) => ({
  id: d.serial().primaryKey(),
  storeId: d.serial().notNull(),
  productId: d.serial().notNull(),
}));

export const recordRelations = relations(records, ({ one }) => ({
  store: one(stores, {
    fields: [records.storeId],
    references: [stores.id],
  }),
  product: one(products, {
    fields: [records.productId],
    references: [products.id],
  }),
}));
