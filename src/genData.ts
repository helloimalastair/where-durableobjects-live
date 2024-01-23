import type { Context } from "hono";

const REGIONS = ["wnam", "enam", "sam", "weur", "eeur", "apac", "oc", "afr", "me"] as const;
const JURISDICTIONS = ["eu", "fedramp"] as const;

export default async function (c: Context<{ Bindings: Environment }>) {
	const originColo = (c.req.raw.cf as IncomingRequestCfProperties).colo;
	const start = Date.now();
	const [durableColo, end] = await (await c.env.DO.get(c.env.DO.newUniqueId()).fetch(c.req.raw)).json<[string, number]>();
	c.executionCtx.waitUntil((async (): Promise<void> => {
		c.env.WDL.writeDataPoint({ indexes: [durableColo], blobs: [originColo], doubles: [(end - start) / 2] });
		await fetch("https://1.1.1.1/cdn-cgi/trace"); // Reset timer
		for (const region of REGIONS) {
			const start = Date.now();
			const [durableColo, end] = await (await c.env.DO.get(c.env.DO.newUniqueId(), {
				locationHint: region,
			}).fetch(c.req.raw)).json<[string, number]>();
			c.env.WDL.writeDataPoint({ indexes: [durableColo], blobs: [originColo, region], doubles: [(end - start) / 2] });
		}
		for(const jurisdiction of JURISDICTIONS) {
			const subnamespace = c.env.DO.jurisdiction(jurisdiction);
			const start = Date.now();
			const [durableColo, end] = await (await subnamespace.get(subnamespace.newUniqueId()).fetch(c.req.raw)).json<[string, number]>();
			c.env.WDL.writeDataPoint({ indexes: [durableColo], blobs: [originColo, "", jurisdiction], doubles: [(end - start) / 2] });
		}
	})());
	return [originColo, durableColo];
};