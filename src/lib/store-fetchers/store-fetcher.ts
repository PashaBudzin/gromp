import { and, eq, inArray } from "drizzle-orm";
import { db } from "~/server/db";
import { records, type ProductsSelect } from "~/server/db/schema";
import { products } from "~/server/db/schema";

export type ProductRecord = {
  priceUAH: number;
  loyaltyPriceUAH: number | null | undefined;
  priceBeforeSaleUAH: number | null | undefined;
  isOnSale: boolean;
  name: string;
  imageURL: string;
  storeId: number;
  link: string;
};

export interface StoreFetcher {
  fetch(): Promise<ProductRecord[]>;
  readonly storeId: number;
}

export async function createDbRecords(storeFetcher: StoreFetcher) {
  const data = await storeFetcher.fetch();
  const BATCH_SIZE = 1000;

  console.log(
    `successfully fetched data with store fetcher for id ${storeFetcher.storeId}; data has length of ${data.length}`,
  );

  const existingProducts = await db
    .select({ name: products.name, id: products.id })
    .from(products)
    .where(
      and(
        eq(products.storeId, storeFetcher.storeId),
        inArray(
          products.name,
          data.map((v) => v.name),
        ),
      ),
    );

  const productMap = new Map<string, number>();

  for (const product of existingProducts) {
    productMap.set(product.name, product.id);
  }

  const missingProducts = data
    .filter((v) => !productMap.has(v.name))
    .map((v) => ({
      name: v.name,
      storeId: storeFetcher.storeId,
      pictureUrl: v.imageURL,
      link: v.link,
    }));

  for (let i = 0; i < missingProducts.length; i += BATCH_SIZE) {
    const insertedProducts = await db
      .insert(products)
      .values(missingProducts.slice(i, i + BATCH_SIZE))
      .onConflictDoNothing()
      .returning();

    for (const product of insertedProducts) {
      productMap.set(product.name, product.id);
    }
  }

  const recordsToInsert = data.map((v) => {
    const productId = productMap.get(v.name);
    if (!productId) throw new Error(`Product not found for ${v.name}`);

    return {
      priceUAH: v.priceUAH.toString(),
      priceBeforeSale: v.priceBeforeSaleUAH?.toString() ?? null,
      loyaltyPriceUAH: v.loyaltyPriceUAH?.toString() ?? null,
      isOnSale: v.isOnSale,
      productId: productId,
    };
  });

  for (let i = 0; i < recordsToInsert.length; i += BATCH_SIZE) {
    await db.insert(records).values(recordsToInsert.slice(i, i + BATCH_SIZE));
  }
}
