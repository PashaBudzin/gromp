import { db } from "~/server/db";
import type { ProductRecord, StoreFetcher } from "./store-fetcher";
import { stores } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export class SilpoFetcher implements StoreFetcher {
  static #instance: SilpoFetcher;
  static #storeId: number;

  private constructor() {}

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
    return [];
  }
}
