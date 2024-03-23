import { binding } from "cf-bindings-proxy";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (c) => {
	const KV = binding<KVNamespace>("KV", { fallback: c.platform?.env! });
	return new Response(await KV.get("api/v1"), {
		headers: {
			"content-type": "application/json",
		},
	});
};

export const OPTIONS: RequestHandler = () => new Response(null, { status: 204, headers: {
	"allow": "GET, OPTIONS",
	"access-control-allow-origin": "*"
} });