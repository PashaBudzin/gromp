import { and, eq } from "drizzle-orm";
import { AtbFetcher } from "~/lib/store-fetchers/atb-fetcher";
import { db } from "~/server/db";
import { products, records } from "~/server/db/schema";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const atbFetcher = await AtbFetcher.getInstance();

  const data = await atbFetcher.fetch();

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
              storeId: atbFetcher.storeId,
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

  return new Response("ok", { status: 200 });
}
