import { db } from "~/server/db";
import type { ProductRecord, StoreFetcher } from "./store-fetcher";
import { stores } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export class SilpoFetcher implements StoreFetcher {
  static #instance: SilpoFetcher;
  static #storeId: number;

  private constructor() {
    // do nothing
  }

  private static async createInstance() {
    await db.insert(stores).values({ name: "silpo" }).onConflictDoNothing();

    const [atb] = await db
      .selectDistinct({ id: stores.id })
      .from(stores)
      .where(eq(stores.name, "silpo"))
      .limit(1);

    if (!atb?.id) throw new Error("failed to fetch atb instance");

    SilpoFetcher.#storeId = atb?.id;

    return new SilpoFetcher();
  }

  public static async getInstance() {
    if (!SilpoFetcher.#instance)
      SilpoFetcher.#instance = await SilpoFetcher.createInstance();
    return SilpoFetcher.#instance;
  }

  public get storeId(): number {
    return SilpoFetcher.#storeId;
  }

  public async fetch() {
    const result: ProductRecord[] = [];

    const categories = [
      "frukty-ovochi-4788",
      "m-iaso-4411",
      "ryba-4430",
      "kovbasni-vyroby-i-m-iasni-delikatesy-4731",
      "syry-1468",
      "khlib-ta-vypichka-5121",
      "gotovi-stravy-i-kulinariia-4761",
      "molochni-produkty-ta-iaitsia-234",
      "vlasni-marky-5202",
      "lavka-tradytsii-4487",
      "zdorove-kharchuvannia-4864",
      "bakaliia-i-konservy-4870",
      "sousy-i-spetsii-4938",
      "solodoshchi-498",
      "sneky-ta-chypsy-5016",
      "kava-chai-359",
      "napoi-52",
      "zamorozhena-produktsiia-264",
      "alkogol-22",
      "sygarety-stiky-zhuiky-4384",
      "kvity-tovary-dlia-sadu-ta-gorodu-476",
      "dlia-domu-567",
      "gigiiena-ta-krasa-4519",
      "dytiachi-tovary-449",
      "dlia-tvaryn-653",
    ];
    const limit = 100;

    const store = "1ee7fab3-7713-6a0c-b802-8d149aac137a";

    for (const cat of categories) {
      let pages = 1;
      for (let page = 0; page <= pages; page++) {
        console.log(`fetching page ${page}/${pages} [SILPO FETCHER]`);
        result.push(
          ...((await fetch(
            `https://sf-ecom-api.silpo.ua/v1/uk/branches/${store}/products?limit=${limit}&offset=${page * limit}&category=${cat}&includeChildCategories=true`,
            {
              body: null,
              method: "GET",
            },
          )
            .then((r) => r.json())
            .then((d) => {
              const data = z
                .object({
                  total: z.number(),
                  items: z.array(
                    z.object({
                      oldPrice: z.number().nullish(),
                      price: z.number(),
                      title: z.string(),
                      slug: z.string(),
                      icon: z.string(),
                    }),
                  ),
                })
                .parse(d);

              console.log(
                `successfully fetched page ${page}/${pages} [SILPO FETCHER]`,
              );

              pages = Math.ceil(data.total / limit);

              return data.items.map((item) => {
                const i: ProductRecord = {
                  isOnSale: !!item.oldPrice,
                  priceBeforeSaleUAH: item.oldPrice,
                  priceUAH: item.price,
                  name: item.title,
                  imageURL: `https://images.silpo.ua/products/600x600/webp/${item.icon}.png`,
                  link: `https://silpo.ua/product/${item.slug}`,
                  loyaltyPriceUAH: null,
                  storeId: this.storeId,
                };
                return i;
              }) as ProductRecord[];
            })
            .catch((err) => {
              console.error(err);
              return [];
            })) as ProductRecord[]),
        );
      }
    }

    return result;
  }
}

const silpoFetcher = await SilpoFetcher.getInstance();
console.log(await silpoFetcher.fetch());
