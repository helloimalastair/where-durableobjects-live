import { env } from "cloudflare:workers";
import type { CoverageSQLResponse, FrontpageField, HourlySQLResponse } from "@wdol/types";
import { analyticsEngineQuery } from "./utils";

export default async function (): Promise<FrontpageField> {
	const [{ data: [{ coverage }] }, { data: [{ hourly }] }] = await analyticsEngineQuery<[CoverageSQLResponse, HourlySQLResponse]>([
		"SELECT intDiv(COUNT(DISTINCT index1) / COUNT(DISTINCT blob1), 0.0001) / 100 AS coverage FROM WDL WHERE NOT isEmpty(index1) AND NOT isEmpty(blob1) AND timestamp > NOW() - INTERVAL '5' MINUTE",
		"SELECT COUNT() / 1 as hourly FROM WDL WHERE timestamp > NOW() - INTERVAL '1' HOUR"
	]);
	const data = {
		coverage,
		hourly,
	};
	return data;
}
