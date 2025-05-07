import { and, eq } from "drizzle-orm";
import { db } from "~/server/db";
import { records } from "~/server/db/schema";
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

  console.log(
    `successfully fetched data with store fetcher for id ${storeFetcher.storeId}; data has length of ${data.length}`,
  );

  await Promise.all(
    data.map(async (v) => {
      let product = (
        await db
          .select()
          .from(products)
          .where(
            and(eq(products.storeId, v.storeId), eq(products.name, v.name)),
          )
          .limit(1)
      ).at(0);

      if (product == null) {
        product = (
          await db
            .insert(products)
            .values({
              name: v.name,
              storeId: storeFetcher.storeId,
              pictureUrl: v.imageURL,
            })
            .onConflictDoNothing()
            .returning()
        )?.at(0);

        if (!product) throw new Error("failed to create new product");
      }

      await db.insert(records).values({
        priceUAH: v.priceUAH.toString(),
        priceBeforeSale: v.priceBeforeSaleUAH?.toString() ?? null,
        loyaltyPriceUAH: v.loyaltyPriceUAH?.toString() ?? null,
        isOnSale: v.isOnSale,
        productId: product.id,
      });
    }),
  );
}
