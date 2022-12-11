import rows from "./rows";
import HTML from "./template";
import coloFetch from "./colos";
import type { Handler } from "hono";

const htmlGenerator: Handler = async (c) => {
	if (!c.req.cf) {
		return c.text("CFData unavailable", 500);
	}
	const res = await (await fetch("https://durable.goalastair.com/json")).json<JSONResponse>();
	if (!res) {
		return c.text("KV Error", 500);
	}
	const getColo = await coloFetch();
	return c.html(HTML(res.data.coverage * 100, (c.req.cf as { city: string }).city, getColo(res.eyeball.worker), getColo(res.eyeball.durable), rows(getColo, res.data.colos), res.data.hourly), 200);
};
export default htmlGenerator;