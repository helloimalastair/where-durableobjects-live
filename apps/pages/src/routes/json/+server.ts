import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ platform }) => {
	if (!platform) {
		throw error(500, "Platform not found");
	}
	return new Response(await platform.env.KV.get("api/v1"), {
		headers: {
			"content-type": "application/json",
		},
	});
};

export { OPTIONS } from "$lib";
