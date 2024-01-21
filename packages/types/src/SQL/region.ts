import type { Region } from "@wdol/shared";
import type { DurableObjectColo, WorkerColo } from "../misc";

interface RegionSQLResponse {
	data: [{
		durable: DurableObjectColo,
		region: Region,
		count: number
	}]
}
interface RegionLatencySQLResponse {
	data: [{
		colo: WorkerColo,
		region: Region,
		latency: number
	}]
}

export type { RegionSQLResponse, RegionLatencySQLResponse };