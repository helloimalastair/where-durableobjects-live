import type { Context } from "hono";

const REGIONS = ["wnam", "enam", "sam", "weur", "eeur", "apac", "oc", "afr", "me"] as const;

export default async function (c: Context<{ Bindings: Environment }>) {
	const originColo = (c.req.raw.cf as IncomingRequestCfProperties).colo;
	const start = Date.now();
	const durableColo = await (await c.env.DO.get(c.env.DO.newUniqueId()).fetch(c.req.raw)).text();
	const end = Date.now();
	const blobs = [originColo, durableColo];
	c.executionCtx.waitUntil((async (): Promise<void> => {
		c.env.WDL.writeDataPoint({ indexes: [durableColo], blobs, doubles: [(end - start) / 2] });
		await fetch("https://1.1.1.1/cdn-cgi/trace"); // Reset timer
		for (const region of REGIONS) {
			const start = Date.now();
			const durableColo = await (await c.env.DO.get(c.env.DO.newUniqueId(), {
				locationHint: region,
			}).fetch(c.req.raw)).text();
			const end = Date.now();
			c.env.WDL.writeDataPoint({ indexes: [durableColo], blobs: [originColo, durableColo, region], doubles: [(end - start) / 2] });
		}
	})());
	return blobs;
};