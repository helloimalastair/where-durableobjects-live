const colos = async (env: Environment): Promise<ColoJSONV2> => {
	const { data } = await (await fetch(
		"https://api.cloudflare.com/client/v4/accounts/864cdf76f8254fb5539425299984d766/analytics_engine/sql",
		{
			method: "POST",
			headers: {
				"content-type": "text/plain",
				authorization: `Bearer ${env.API_TOKEN}`,
			},
			body: "SELECT blob1 as worker, index1 as durable, count() as ammt, avg(double1) as latency FROM WDL WHERE isEmpty(blob3) GROUP BY blob1, index1",
		},
	)).json<SQLResponse>();
	const collapsedEntries = Object.entries(data.reduce((obj, row) => {
		if (!obj[row.worker]) {
			obj[row.worker] = {};
		}
		if (!obj[row.worker][row.durable]) {
			obj[row.worker][row.durable] = { hits: 0, latency: 0 };
		}
		obj[row.worker][row.durable].hits += Number(row.ammt);
		obj[row.worker][row.durable].latency += row.latency;
		return obj;
	}, {} as SQLParsed));
	const sortedAndReformatted = collapsedEntries
		.map(([workerColo, rows]) => {
			let rowsSorted = Object.entries(rows).sort(([coloAName], [coloBName]) =>
				coloAName.localeCompare(coloBName),
			);
			const total = rowsSorted.reduce((accumulator, [_, row]) => accumulator + row.hits, 0);
			return [
				workerColo,
				Object.fromEntries(
					rowsSorted.map(([doColo, { hits, latency }]) => [
						doColo,
						{
							likehlihood: Number((hits / total).toFixed(4)),
							latency: Number(latency.toFixed(2))
						}
					]),
				),
			];
		})
		.sort(([coloAName], [coloBName]) => (coloAName as string).localeCompare(coloBName as string));
	return Object.fromEntries(sortedAndReformatted);
};
export default colos;
