import { SilpoFetcher } from "~/lib/store-fetchers/silpo-fetcher";
import { createDbRecords } from "~/lib/store-fetchers/store-fetcher";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const silpoFetcher = await SilpoFetcher.getInstance();

  await createDbRecords(silpoFetcher);

  return new Response("ok", { status: 200 });
}
