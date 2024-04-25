import type { DurableObjectColo, WorkerColo } from "..";
export interface ColoSQLResponse {
	data: [
		{
			durable: DurableObjectColo;
			colo: WorkerColo;
			count: number;
			latency: number;
		},
	];
}
