import rows from "./rows";
import HTML from "./template";
import { nanoid } from "nanoid";
import headers from "./headers";
import coloFetch from "./colos";
import genData from "../genData";
import type { Handler } from "hono";

const htmlOptions: Handler = () => new Response(null, { status: 204, headers: headers() });

const html:Handler<{ Bindings: Environment }> = async (c) => {
	if (!c.req.cf) {
		return c.text("CFData unavailable", 500);
	}
	const getColo = await coloFetch();
	let [worker, durable] = await genData(c);
	worker = getColo(worker);
	durable = getColo(durable);
	const sql = await c.env.KV.get<KVEntry>("wdl", "json");
	if (!sql) {
		return c.text("KV Error", 500);
	}
	const nonce = nanoid();
	return c.html(HTML(nonce, sql.coverage * 100, (c.req.cf as { city: string }).city, worker, durable, rows(getColo, sql.colos), sql.hourly), 200, headers(nonce));
};

export { htmlOptions, html };