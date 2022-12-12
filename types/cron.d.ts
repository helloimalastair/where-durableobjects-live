interface SQLResponse {
	data: {
		[key: string]: string
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