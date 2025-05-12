import { asc, desc, eq, ilike, sql } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import {
  products,
  records,
  type ProductsSelect,
  type RecordSelect,
} from "~/server/db/schema";

export const productRouter = createTRPCRouter({
  searchProducts: publicProcedure
    .input(
      z.object({
        query: z.string(),
        limit: z.number().max(100).default(50),
        skip: z.number().default(0),
        cursor: z.number().default(0),
        sort: z
          .enum(["priceAsc", "priceDesc", "alphabetAsc", "alphabetDesc"])
          .default("alphabetAsc"),
      }),
    )
    .query(async (opts) => {
      const { query, limit, sort } = opts.input;

      let skip = opts.input.cursor;
      if (opts.input.skip) skip = opts.input.skip;

      const latestPrice = sql<string>`(
        SELECT "price_UAH"
        FROM ${records} 
        WHERE ${records.productId} = ${products.id} 
        ORDER BY ${records.createdAt} DESC 
        LIMIT 1
      )`.as("latestPrice");

      const latestPriceBeforeSale = sql<string | null>`(
        SELECT "price_before_sale"
        FROM ${records}
        WHERE ${records.productId} = ${products.id}
        ORDER BY "createdAt" DESC
        LIMIT 1
    )`.as("latestPriceBeforeSale");

      const latestIsOnSale = sql<boolean | null>`(
        SELECT "on_sale"
        FROM ${records}
        WHERE ${records.productId} = ${products.id}
        ORDER BY "createdAt" DESC
        LIMIT 1
    )`.as("latestIsOnSale");

      const sorting = {
        priceAsc: asc(latestPrice),
        priceDesc: desc(latestPrice),
        alphabetAsc: asc(products.name),
        alphabetDesc: desc(products.name),
      }[sort];

      const data = await db
        .select({
          id: products.id,
          name: products.name,
          storeId: products.storeId,
          pictureUrl: products.pictureUrl,
          latestPriceBeforeSale,
          latestIsOnSale,
          latestPrice,
        })
        .from(products)
        .where(ilike(products.name, `%${query}%`))
        .leftJoin(records, eq(records.productId, products.id))
        .orderBy(sorting)
        .limit(limit)
        .offset(skip);

      return data;
    }),

  getProductById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async (opts) => {
      const { id } = opts.input;

      return await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
          records: true,
          store: {
            columns: {
              name: true,
            },
          },
        },
      });
    }),
});
