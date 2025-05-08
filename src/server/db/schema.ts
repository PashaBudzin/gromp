// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { check, pgTableCreator, unique } from "drizzle-orm/pg-core";
import {
  relations,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";

export const createTable = pgTableCreator((name) => `gromp_${name}`);

export const products = createTable(
  "product",
  (d) => ({
    id: d.serial("id").primaryKey(),
    name: d.text("name").notNull(),
    pictureUrl: d.text("picture_url"),
    createdAt: d.timestamp().defaultNow().notNull(),
    storeId: d.serial().notNull(),
    link: d.text("link").notNull(),
  }),

  (t) => ({
    uniqueNamePerStore: unique().on(t.storeId, t.name),
  }),
);

export type ProductsSelect = InferSelectModel<typeof products>;
export type ProductsInsert = InferInsertModel<typeof products>;

export const productsRelations = relations(products, ({ many, one }) => ({
  records: many(records),
  store: one(stores, {
    fields: [products.storeId],
    references: [stores.id],
  }),
}));

export const stores = createTable("stores", (d) => ({
  id: d.serial("id").primaryKey(),
  name: d.text("name").notNull().unique(),
}));

export const storeRelations = relations(stores, ({ many }) => ({
  products: many(products),
}));

export const records = createTable(
  "records",
  (d) => ({
    id: d.serial().primaryKey(),
    priceUAH: d.numeric("price_UAH").notNull(),
    loyaltyPriceUAH: d.numeric("loyalty_price_UAH"),
    isOnSale: d.boolean("on_sale").default(false),
    priceBeforeSale: d.numeric("price_before_sale"),
    productId: d.serial().notNull(),
    createdAt: d.timestamp().defaultNow().notNull(),
  }),
  () => ({
    checks: [
      check(
        "on_sale_requires_price_before_sale",
        sql`(on_sale = false AND price_before_sale IS NULL) OR (on_sale = true AND price_before_sale IS NOT NULL)`,
      ),
    ],
  }),
);

export type RecordSelect = InferSelectModel<typeof records>;
export type RecordInsert = InferInsertModel<typeof records>;

export const recordRelations = relations(records, ({ one }) => ({
  product: one(products, {
    fields: [records.productId],
    references: [products.id],
  }),
}));
