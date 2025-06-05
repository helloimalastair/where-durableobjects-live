import type { RequestHandler } from "@sveltejs/kit";

export * from "./status";
export * from "./map";
export * from "./genData";

export const OPTIONS: RequestHandler = () =>
	new Response(null, {
		status: 204,
		headers: {
			allow: "GET, OPTIONS",
			"access-control-allow-origin": "*",
		},
	});