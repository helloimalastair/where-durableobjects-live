import type { Context } from "hono";

export default async function (c: Context<{ Bindings: Environment }>) {
	const originColo = (c.req.raw.cf as IncomingRequestCfProperties).colo;
	const start = Date.now();
	const durableColo = await (await c.env.DO.get(c.env.DO.newUniqueId()).fetch(c.req.raw)).text();
	const end = Date.now();
	const blobs = [originColo, durableColo];
	c.env.WDL.writeDataPoint({ indexes: [durableColo], blobs, doubles: [(end - start) / 2] });
	return blobs;
};