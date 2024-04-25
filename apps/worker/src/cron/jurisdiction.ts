import type { Jurisdiction } from "@wdol/shared";
import { analyticsEngineQuery } from "./utils";
import type { JurisdictionSQLResponse, JurisdictionField } from "@wdol/types";

export default async function(env: Environment): Promise<JurisdictionField> {
	const { data } = await analyticsEngineQuery<JurisdictionSQLResponse>(
		"SELECT index1 as durable, blob3 as jurisdiction, COUNT() / 1 as count FROM WDL WHERE timestamp > NOW() - INTERVAL '5' MINUTE AND NOT isEmpty(index1) AND NOT isEmpty(blob3) GROUP BY index1, blob3"
	, env.API_TOKEN);
	const clean: JurisdictionField = {
		fedramp: {},
		eu: {}
	};
	for(const { durable, jurisdiction, count } of data) {
		clean[jurisdiction][durable] = count;
	}
	for(const jurisdiction of Object.keys(clean) as Jurisdiction[]) {
		const total = Object.values(clean[jurisdiction]).reduce((a, b) => a + b, 0);
		for(const [durable, count] of Object.entries(clean[jurisdiction])) {
			clean[jurisdiction][durable] = Math.floor(count / total * 1e4) / 100;
		}
	}
	// await env.KV.put("jurisdiction", JSON.stringify(clean));
	return clean;
}