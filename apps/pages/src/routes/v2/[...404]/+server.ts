import type { RequestHandler } from "./$types";

export const fallback: RequestHandler = () =>
	new Response("Not Found", { status: 404 });
