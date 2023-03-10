import { Handler } from "hono";

const cache = caches.default;

const jsonCORSHeaders = {
	"access-control-allow-methods": "GET, OPTIONS",
	"access-control-allow-origin": "*",
	"access-control-max-age": "86400",
};

const jsonOptions: Handler = async () => new Response(null, { status: 204, headers: jsonCORSHeaders });

const json: Handler<{ Bindings: Environment }> = async (c) => {
	const cached = await cache.match(c.req.raw);
	if (cached) {
		return cached;
	}
	const res = c.json(await c.env.KV.get("wdl", "json"), 200, {
		...jsonCORSHeaders,
		"cache-control": "public, max-age=300",
	});
	c.executionCtx.waitUntil(cache.put(c.req.raw, res.clone()));
	return res;
};

export { jsonOptions, json };