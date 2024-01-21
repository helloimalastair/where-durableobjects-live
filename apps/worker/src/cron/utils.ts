async function analyticsEngineQuery<SQLJSONResponse>(queries: string | string[], API_TOKEN: string): Promise<SQLJSONResponse> {
	if(Array.isArray(queries)) {
		return await Promise.all(queries.map(query => analyticsEngineQuery(query, API_TOKEN))) as unknown as SQLJSONResponse;
	}
	return await (await fetch(
		"https://api.cloudflare.com/client/v4/accounts/864cdf76f8254fb5539425299984d766/analytics_engine/sql",
		{
			method: "POST",
			headers: {
				"content-type": "text/plain",
				authorization: `Bearer ${API_TOKEN}`,
			},
			body: queries,
		},
	)).json<SQLJSONResponse>();
}

export { analyticsEngineQuery };