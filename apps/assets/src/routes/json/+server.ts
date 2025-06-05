import { error } from "@sveltejs/kit";
import { dev } from "$app/environment";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request, platform }) => {
	if(!platform) {
		throw error(500, "Platform not found");
	}
	if(!dev && platform.context) {
		const { AXIOM, AXIOM_DATASET } = platform.env;
		AXIOM.ingest(AXIOM_DATASET, {
			api: "v1",
			ua: request.headers.get("user-agent") ?? undefined,
			colo: platform.cf?.colo,
		});
		platform.context.waitUntil(AXIOM.flush());
	}
	return new Response(await platform.env.KV.get("api/v1"), {
		headers: {
			"content-type": "application/json",
		},
	});
};

export { OPTIONS } from "$lib";