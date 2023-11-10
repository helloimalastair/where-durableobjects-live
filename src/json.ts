import type { Handler, Context } from "hono";

const cache = caches.default;

const jsonCORSHeaders = {
	"access-control-allow-methods": "GET, OPTIONS",
	"access-control-allow-origin": "*",
	"access-control-max-age": "86400",
};

const jsonOptions: Handler = async () => new Response(null, { status: 204, headers: jsonCORSHeaders });

const json = async (versionOrName: string, c: Context<{ Bindings: Environment }>) => {
	const cached = await cache.match(c.req.raw);
	if (cached) {
		return cached;
	}
	const res = c.json(await c.env.KV.get("wdl-" + versionOrName, "json"), 200, {
		...jsonCORSHeaders,
		"cache-control": "public, max-age=300",
	});
	c.executionCtx.waitUntil(cache.put(c.req.raw, res.clone()));
	return res;
};

const jsonV1: Handler = async (c) => json("v1", c);

const jsonV2: Handler = async (c) => json("v2", c);

const regions: Handler = async (c) => json("regions", c);

export { jsonOptions, jsonV1, jsonV2, regions };