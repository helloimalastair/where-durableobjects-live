const hourly = async (env: Environment) => parseInt((await (
	await fetch(
		"https://api.cloudflare.com/client/v4/accounts/864cdf76f8254fb5539425299984d766/analytics_engine/sql",
		{
			method: "POST",
			headers: {
				"content-type": "text/plain",
				authorization: env.API_TOKEN,
			},
			body: "SELECT COUNT() FROM NewDOLatency WHERE timestamp > NOW() - INTERVAL '1' HOUR",
		},
	)
).json<CountResponse>()).data[0]["count()"]);
export default hourly;