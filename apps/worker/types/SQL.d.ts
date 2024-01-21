interface SQLResponse {
	data: {
		worker: string,
		durable: string,
		count: number,
		latency: number,
	}[],
}

interface RegionSQLResponse {
	data: {
		worker: string,
		durable: string,
		region: string,
		latency: number,
	}[],
}

interface JurisdictionSQLResponse {
	data: {
		worker: string,
		durable: string,
		jurisdiction: string,
		latency: number,
	}[],
}