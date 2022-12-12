import { Hono } from "hono";
import scheduled from "./cron";
import genData from "./genData";
import { html, htmlOptions } from "./HTML";
import { json, jsonOptions } from "./json";
import { globe, globeOptions } from "./assets";

const app = new Hono<{ Bindings: Environment }>();

app.options("/icon", globeOptions);

app.get("/icon", globe);

app.get("/ping", async (c) => {
	await genData(c);
	return c.text("OK");
});

app.options("/json", jsonOptions);

app.get("/json", json);

app.get("/cron", async c => {
	if(new URL(c.req.url).searchParams.get("key") === "SuperDurableSuperObjects") {
		await scheduled({} as ScheduledController, c.env, c.executionCtx);
		return c.text("OK");
	}
});

app.options("/", htmlOptions);

app.get("/", html);

const handler: ExportedHandler<Environment> = {
	fetch: app.fetch,
	scheduled,
};
export default handler;
export { DO } from "./DO";