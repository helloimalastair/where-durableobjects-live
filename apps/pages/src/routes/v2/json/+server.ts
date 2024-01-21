import { binding } from "cf-bindings-proxy";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async (c) => {
	const KV = binding<KVNamespace>("KV", { fallback: c.platform?.env! });
	return new Response(await KV.get("api/v2"), {
		headers: {
			"content-type": "application/json",
		},
	});
};