import { genData } from "$lib";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ platform }) => {
	const res = await genData(platform);
	if (!res) {
		return new Response("This endpoint only functions when deployed.", {
			status: 500,
		});
	}
	return new Response(null);
};
