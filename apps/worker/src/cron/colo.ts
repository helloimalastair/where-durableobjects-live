import { analyticsEngineQuery } from "./utils";
import type { ColoField, ColoFrom, ColoTo, ColoSQLResponse } from "@wdol/types";

export default async function(env: Environment): Promise<ColoField> {
	const { data } = await analyticsEngineQuery<ColoSQLResponse>(
		"SELECT index1 as durable, blob1 as colo, COUNT() / 1 as count, intDiv(AVG(double1), 0.01) / 100 as latency FROM WDL WHERE timestamp > NOW() - INTERVAL '5' MINUTE AND NOT isEmpty(index1) AND NOT isEmpty(blob1) AND isEmpty(blob2) AND isEmpty(blob3) GROUP BY index1, blob1"
	, env.API_TOKEN);
	const clean: Record<string, Record<string, {
		count: number,
		latency: number
	}>> = {};
	for(const { durable, colo, count, latency } of data) {
		if(!clean[colo]) {
			clean[colo] = { };
		}
		clean[colo][durable] = {
			count,
			latency
		};
	}
	const from: ColoFrom = {};
	const to: ColoTo = {};
	for(const colo of Object.keys(clean)) {
		let total = Object.values(clean[colo]).reduce((a, b) => a + b.count, 0);
		for(const [durable, { count }] of Object.entries(clean[colo])) {
			clean[colo][durable].count = Math.floor(count / total * 1e4) / 100;
			if(!from[durable]) {
				from[durable] = [];
			}
			from[durable].push(colo);
		}
		to[colo] = Object.entries(clean[colo]).map(([code, { count, latency }]) => ({
			code,
			likelihood: count,
			latency
		})).sort((a, b) => {
			if(a.likelihood === b.likelihood) {
				return a.latency - b.latency;
			}
			return b.likelihood - a.likelihood;
		});
	}
	// await env.KV.put("colo", JSON.stringify({ from, to }));
	return {
		from,
		to
	};
}