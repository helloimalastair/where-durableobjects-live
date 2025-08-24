import { env } from "cloudflare:workers";
async function analyticsEngineQuery<SQLJSONResponse>(queries: string | string[]): Promise<SQLJSONResponse> {
	if (Array.isArray(queries)) {
		return await Promise.all(queries.map(query => analyticsEngineQuery(query))) as unknown as SQLJSONResponse;
	}
	const res = await (await fetch(
		"https://api.cloudflare.com/client/v4/accounts/864cdf76f8254fb5539425299984d766/analytics_engine/sql",
		{
			method: "POST",
			headers: {
				"content-type": "text/plain",
				authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
			},
			body: queries,
		},
	)).text();
	try {
		return JSON.parse(res) as SQLJSONResponse;
	} catch (e) {
		console.error(res);
		throw e;
	}
}

export { analyticsEngineQuery };
