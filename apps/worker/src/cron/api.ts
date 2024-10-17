import type { Region } from "@wdol/shared";
import type { DurableObjectColo, LiveKV, WorkerColo } from "@wdol/types";

export default async function api(live: LiveKV, env: Env) {
	const base = {
		hourly: live.frontpage.hourly,
		coverage: Math.floor(live.frontpage.coverage * 100) / 1e4,
	};
	const v1: Record<WorkerColo, Record<DurableObjectColo, number>> = {};
	const v2: Record<WorkerColo, Record<DurableObjectColo, {
		likelihood: number,
		latency: number,
	}>> = {};
	const v3: Record<WorkerColo, {
		hosts: Record<DurableObjectColo, {
			likelihood: number,
			latency: number,
		}>,
		nearestRegion: Region,
	}> = {};
	for(const [worker, durables] of Object.entries(live.colo.to)) {
		v1[worker] = {};
		v2[worker] = {};
		v3[worker] = {
			hosts: {},
			nearestRegion: live.region.latency[worker][0].code
		};
		for(const durable of durables) {
			const likelihood = Math.floor(durable.likelihood * 100) / 1e4;
			v1[worker][durable.code] = likelihood;
			v2[worker][durable.code] = {
				likelihood: likelihood,
				latency: durable.latency
			};
			v3[worker].hosts[durable.code] = {
				likelihood: likelihood,
				latency: durable.latency
			};
		}
	}
	await Promise.all([
		env.KV.put("api/v1", JSON.stringify({
			...base,
			colos: v1
		})),
		env.KV.put("api/v2", JSON.stringify({
			...base,
			colos: v2
		})),
		env.KV.put("api/v3", JSON.stringify({
			...base,
			colos: v3
		}))
	]);
}