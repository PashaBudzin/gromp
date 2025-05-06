import { db } from "~/server/db";
import type { ProductRecord, StoreFetcher } from "./store-fetcher";
import {
  stores,
  type ProductsInsert,
  type RecordInsert,
} from "~/server/db/schema";
import { load } from "cheerio";
import { z } from "zod";
import { eq } from "drizzle-orm";

class AtbFetcher implements StoreFetcher {
  static #instance: AtbFetcher;
  static #storeId: number;

  private constructor() {}

  private static async createInstance() {
    await db.insert(stores).values({ name: "ATB" }).onConflictDoNothing();

    const [atb] = await db
      .selectDistinct({ id: stores.id })
      .from(stores)
      .where(eq(stores.name, "ATB"))
      .limit(1);

    if (!atb?.id) throw new Error("failed to fetch atb instance");

    AtbFetcher.#storeId = atb?.id;

    return new AtbFetcher();
  }

  public static async getInstance() {
    if (!AtbFetcher.#instance)
      AtbFetcher.#instance = await AtbFetcher.createInstance();
    return AtbFetcher.#instance;
  }

  async fetch() {
    const categories = [
      287, 285, 585, 292, 294, 591, 299, 422, 344, 353, 325, 322, 286, 318, 551,
      360, 339, 415, 502, 373, 308,
    ];
    const STORE = 1007;

    let pages = 1;
    const result: ProductRecord[] = [];

    for (const cat of categories) {
      console.log(`fetching for category ${cat}`);
      for (let page = 1; page <= pages; page++) {
        console.log(`fetching page ${page}/${pages} `);
        const newData = await fetch(
          `https://www.atbmarket.com/shop/catalog/wloadmore?loadMore=&customCat=&cat=${cat}&store=${STORE}&page=${page}`,
          {
            body: null,
            method: "GET",
          },
        )
          .then((r) => r.json())
          .then((d: unknown) => {
            const data = z
              .object({
                markup: z.string(),
                page_count: z.number(),
              })
              .parse(d);

            pages = data.page_count;

            console.log(`successfuly fetched page ${page}/${pages} `);
            const $ = load(data.markup);

            const items: ProductRecord[] = [];

            $(".catalog-item").each((_, e) => {
              const $child = $(e);
              const price = Number(
                $child.find(".product-price__top").attr("value"),
              );
              const priceBeforeSale =
                Number($child.find(".product-price__bottom").attr("value")) ||
                null;

              const title = $child.find(".catalog-item__title").text();

              const isOnSale = $child
                .find(".catalog-item__product-price")
                .hasClass("product-price--sale");

              const imageURL = $child.find(".catalog-item__img").attr("src");
              const priceWithLoyalty =
                Number($child.find(".atbcard-sale__price-top").attr("value")) ||
                null;

              const link = $child
                .find(".catalog-item__photo-link")
                .attr("href");

              if (!price || !title || isOnSale == null || !imageURL || !link)
                throw new Error("failed to read children of catalog entry");

              const newItem = {
                imageURL,
                name: title,
                priceUAH: price,
                priceBeforeSaleUAH: priceBeforeSale,
                isOnSale,
                link: "https://www.atbmarket.com" + link,
                loyaltyPriceUAH: priceWithLoyalty,
                storeId: AtbFetcher.#storeId,
              };

              items.push(newItem);
            });

            return items;
          })
          .catch((e) => {
            console.error(e);
            return [];
          });

        result.push(...newData);
      }
      pages = 1;
    }

    return result;
  }
}

const fetcher = await AtbFetcher.getInstance();

console.log(JSON.stringify(await fetcher.fetch()));
