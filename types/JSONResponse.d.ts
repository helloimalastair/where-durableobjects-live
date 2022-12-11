interface Colos {
	[key: string]: {
		[key: string]: number
	}
}
interface JSONResponse {
	eyeball: {
		worker: string,
		durable: string
	}
	data: {
		hourly: number
		coverage: number
		colos: Colos
	}
}