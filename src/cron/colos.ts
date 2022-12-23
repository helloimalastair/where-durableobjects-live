const colos = async (env: Environment) => {
	return Object.fromEntries(
		Object.entries(
			(
				await (await fetch(
					"https://api.cloudflare.com/client/v4/accounts/864cdf76f8254fb5539425299984d766/analytics_engine/sql",
					{
						method: "POST",
						headers: {
							"content-type": "text/plain",
							authorization: env.API_TOKEN,
						},
						body: "SELECT blob1 as worker, blob2 as durable, count() as ammt FROM NewDOLatency GROUP BY blob1, blob2",
					},
				)).json<SQLResponse>()
			).data.reduce((a, b) => {
				if (!a[b.worker]) {
					a[b.worker] = {};
				}
				a[b.worker][b.durable] = (a[b.worker][b.durable] || 0) + b.ammt;
				return a;
			}, {} as SQLParsed),
		)
			.map((e) => {
				let rows = Object.entries(e[1]).sort((a, b) =>
					a[0].localeCompare(b[0]),
				);
				const total = rows.reduce((a, b) => a + b[1], 0);
				return [
					e[0],
					Object.fromEntries(
						rows.map((e) => [
							e[0],
							Math.round((e[1] / total) * 10000) / 10000,
						]),
					),
				];
			})
			.sort((a, b) => (a[0] as string).localeCompare(b[0] as string)),
	);
};
export default colos;
