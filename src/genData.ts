import type { Context } from "hono";
import { nanoid } from "nanoid";

export default async function (c: Context<string, { Bindings: Environment }>) {
	const data = [
		(c.req.cf as IncomingRequestCfProperties).colo,
		await (await c.env.DO.get(c.env.DO.newUniqueId()).fetch(c.req)).text(),
	];
	c.env.WDL.writeDataPoint({ indexes: [nanoid()], blobs: data });
	return data;
};