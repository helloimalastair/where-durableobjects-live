import rows from "./rows";
import HTML from "./template";
import { nanoid } from "nanoid";
import headers from "./headers";
import coloFetch from "./colos";
import genData from "../genData";
import type { Handler } from "hono";

const htmlOptions: Handler = () => new Response(null, { status: 204, headers: headers() });

const html: Handler<{ Bindings: Environment }> = async (c) => {
	if (!c.req.raw.cf) {
		return c.text("CFData unavailable", 500);
	}
	const getColo = await coloFetch();
	let [worker, durable] = await genData(c);
	worker = getColo(worker);
	durable = getColo(durable);
	const sql = await c.env.KV.get<KVEntry<ColoJSONV1>>("wdl-v1", "json");
	if (!sql) {
		return c.text("KV Error", 500);
	}
	const nonce = nanoid();
	const rowsHtml = rows(getColo, sql.colos);
	console.log(rowsHtml);
	return c.html(HTML(nonce, Math.round(sql.coverage * 10000) / 100, (c.req.raw.cf as { city: string }).city, worker, durable, rowsHtml, sql.hourly), 200, headers(nonce));
};

export { htmlOptions, html };