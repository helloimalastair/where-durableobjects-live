import { Region } from "@wdol/shared";
import { analyticsEngineQuery } from "./utils";
import type { RegionSQLResponse, RegionLatencySQLResponse, RegionLatency, RegionField, RegionHosts, WorkerColo } from "@wdol/types";

export default async function(env: Environment): Promise<RegionField> {
	const [{ data: regionHosts }, { data: latencyRaw }] = await analyticsEngineQuery<[RegionSQLResponse, RegionLatencySQLResponse]>([
		"SELECT index1 as durable, blob2 as region, COUNT() / 1 as count FROM WDL WHERE timestamp > NOW() - INTERVAL '5' MINUTE AND NOT isEmpty(index1) AND NOT isEmpty(blob2) GROUP BY index1, blob2",
		"SELECT blob1 as colo, blob2 as region, intDiv(AVG(double1), 0.01) / 100 as latency FROM WDL WHERE timestamp > NOW() - INTERVAL '5' MINUTE AND NOT isEmpty(blob1) AND NOT isEmpty(blob2) GROUP BY blob1, blob2"
	], env.API_TOKEN);
	const hosts: RegionHosts = {
		wnam: { },
		enam: { },
		sam: { },
		weur: { },
		eeur: { },
		apac: { },
		oc: { },
		afr: { },
		me: { },
	};
	for(const { durable, region, count } of regionHosts) {
		hosts[region][durable] = count;
	}
	for(const region of Object.keys(hosts) as Region[]) {
		let total = Object.values(hosts[region]).reduce((a, b) => a + b, 0);
		for(const [durable, count] of Object.entries(hosts[region])) {
			hosts[region][durable] = Math.floor(count / total * 1e4) / 100;
		}
	}
	const coloLatencyPassOne: Record<WorkerColo, Record<string, number>> = {};
	for(const { colo, region, latency } of latencyRaw) {
		if(!coloLatencyPassOne[colo]) {
			coloLatencyPassOne[colo] = {};
		}
		coloLatencyPassOne[colo][region] = latency;
	}
	const coloLatencyPassTwo: RegionLatency = {};
	for(const [colo, regionLatency] of Object.entries(coloLatencyPassOne)) {
		coloLatencyPassTwo[colo] = Object.entries(regionLatency).sort((a, b) => a[1] - b[1]).map(([ code, latency ]) => ({
			code: code as Region,
			latency
		}));
	}
	const data = {
		hosts,
		latency: coloLatencyPassTwo
	};
	// await env.KV.put("region", JSON.stringify(data));
	return data;
}