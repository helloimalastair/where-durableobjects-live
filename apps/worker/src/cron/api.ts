import type { DurableObjectColo, LiveKV, WorkerColo } from "@wdol/types";

export default async function api(live: LiveKV, env: Environment) {
	const base = {
		hourly: live.frontpage.hourly,
		coverage: Math.floor(live.frontpage.coverage * 100) / 1e4,
	};
	const v1: Record<WorkerColo, Record<DurableObjectColo, number>> = {};
	const v2: Record<WorkerColo, Record<DurableObjectColo, {
		likelihood: number,
		latency: number
	}>> = {};
	for(const [worker, durables] of Object.entries(live.colo.to)) {
		v1[worker] = {};
		v2[worker] = {};
		for(const durable of durables) {
			v1[worker][durable.code] = Math.floor(durable.likelihood * 100) / 1e4;
			v2[worker][durable.code] = {
				likelihood: Math.floor(durable.likelihood * 100) / 1e4,
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
		}))
	]);
}