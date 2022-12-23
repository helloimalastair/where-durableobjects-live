interface SQLResponse {
	data: {
		worker: string,
		durable: string,
		ammt: string
	}[]
}
interface SQLParsed {
	[key: string]: {
		[key: string]: number
	}
}
interface KVEntry {
	hourly: number
	coverage: number
	colos: SQLParsed
}
interface CountResponse {
	data:
	[
		{
			"count()": string
		}
	],
}