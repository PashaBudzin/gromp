import { AtbFetcher } from "~/lib/store-fetchers/atb-fetcher";
import { createDbRecords } from "~/lib/store-fetchers/store-fetcher";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const atbFetcher = await AtbFetcher.getInstance();

  await createDbRecords(atbFetcher);

  return new Response("ok", { status: 200 });
}
