import type { WorkerColo, DurableObjectColo } from ".."
interface ColoSQLResponse {
	data: [{
		durable: DurableObjectColo,
		colo: WorkerColo,
		count: number,
		latency: number
	}]
}

export type { ColoSQLResponse };