interface SQLResponse {
	data: {
		worker: string,
		durable: string,
		ammt: string,
		latency: number,
	}[]
}
interface SQLParsed {
	[key: string]: {
		[key: string]: {
			hits: number,
			latency: number
		}
	}
}
interface KVEntry {
	hourly: number
	coverage: number
	colos: ColoJSONV2
}
interface CountResponse {
	data:
	[
		{
			"count()": string
		}
	],
}