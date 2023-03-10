import type { Context } from "hono";

export default async function (c: Context<{ Bindings: Environment }>) {
	const data = [
		(c.req.raw.cf as IncomingRequestCfProperties).colo,
		await (await c.env.DO.get(c.env.DO.newUniqueId()).fetch(c.req.raw)).text(),
	];
	c.env.WDL.writeDataPoint({ indexes: [data[1]], blobs: data });
	return data;
};