interface SQLData {
	worker: string,
	durable: string,
	ammt: string,
	latency: number
}
interface SQLResponse {
	data: SQLData[];
}
interface SQLRegionData extends SQLData {
	region: string;
}
interface SQLRegionResponse {
	data: SQLRegionData[];
}
interface SQLParsed {
	[key: string]: {
		[key: string]: {
			hits: number,
			latency: number
		}
	}
}
interface SingleRegion {
	spawnsIn: {
		[key: string]: number
	},
	latencies: {
		[key: string]: number
	}
}
interface SingleRegionWithCount extends SingleRegion {
	count: {
		[key: string]: number
	}
}
interface RegionMapping {
	[key: string]: SingleRegion
}
interface RegionMappingInterstitial {
	[key: string]: SingleRegionWithCount
}

interface KVEntry<ColoJSON = ColoJSONV2> {
	hourly: number
	coverage: number
	colos: ColoJSON
}
interface CountResponse {
	data:
	[
		{
			"count()": string
		}
	],
}