const getRegions = async (env: Environment): Promise<RegionMapping> => {
	const { data } = await (await fetch(
		"https://api.cloudflare.com/client/v4/accounts/864cdf76f8254fb5539425299984d766/analytics_engine/sql",
		{
			method: "POST",
			headers: {
				"content-type": "text/plain",
				authorization: `Bearer ${env.API_TOKEN}`,
			},
			body: "SELECT blob1 as worker, index1 as durable, blob3 as region, count() as ammt, avg(double1) as latency FROM WDL WHERE NOT isEmpty(blob3) GROUP BY blob1, index1, blob3",
		},
	)).json<SQLRegionResponse>();
	return Object.fromEntries(Object.entries(data.reduce((obj, row) => {
		// If region doesn't exist in map yet, create it
		if (!obj[row.region]) {
			obj[row.region] = {
				spawnsIn: {},
				latencies: {},
				count: {}
			};
		}
		// Add the number of DOs in a colo that spawned in this region
		obj[row.region].spawnsIn[row.durable] = Number(row.ammt);
		// Add together total latency for a colo that spawned in this region
		if (obj[row.region].latencies[row.worker]) {
			obj[row.region].latencies[row.worker] += Number(row.latency);
		} else {
			obj[row.region].latencies[row.worker] = Number(row.latency);
		}
		// Add the number of Workers spawned, to be used for averaging 
		if (obj[row.region].count[row.worker]) {
			obj[row.region].count[row.worker] += Number(row.ammt);
		} else {
			obj[row.region].count[row.worker] = Number(row.ammt);
		}
		return obj;
	}, {} as RegionMappingInterstitial)).map(([region, { spawnsIn, count, latencies }]) => [region, {
		latencies: Object.fromEntries(Object.entries(latencies).map(([worker, latency]) => [worker, Number((latency / count[worker]).toFixed(2))])),
		spawnsIn,
	}]));
};
export default getRegions;
