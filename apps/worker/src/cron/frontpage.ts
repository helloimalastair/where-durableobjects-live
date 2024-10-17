import { analyticsEngineQuery } from "./utils";
import type { CoverageSQLResponse, HourlySQLResponse, FrontpageField } from "@wdol/types";


export default async function(env: Env): Promise<FrontpageField> {
	const [{ data: [{ coverage }] }, { data: [{ hourly }] }] = await analyticsEngineQuery<[CoverageSQLResponse, HourlySQLResponse]>([
		"SELECT intDiv(COUNT(DISTINCT index1) / COUNT(DISTINCT blob1), 0.0001) / 100 AS coverage FROM WDL WHERE NOT isEmpty(index1) AND NOT isEmpty(blob1) AND timestamp > NOW() - INTERVAL '5' MINUTE",
		"SELECT COUNT() / 1 as hourly FROM WDL WHERE timestamp > NOW() - INTERVAL '1' HOUR"
	], env.API_TOKEN);
	const data = {
		coverage,
		hourly,
	};
	// await env.KV.put("frontpage", JSON.stringify(data));
	return data;
}