import type { IATA, WorkerColo, DurableObjectColo } from "..";

/*
	* Represents a mapping of Durable Object colos to Worker colos that may trigger a spawn.
	*/
interface ColoFrom {
	[currentColo: IATA]: WorkerColo[];
}

/*
	* Represents a mapping of Worker colos to Durable Object colos that may be spawned.
	* Includes the likelihood of spawning in that colo, and the average latency to that colo.
	*/
interface ColoTo {
	[currentColo: IATA]: {
		code: DurableObjectColo,
		likelihood: number,
		latency: number
	}[]
}

/*
	* Represents colo-specific data.
	* The `from` field represents the Durable Object to Worker colo mapping, and the `to` field represents the Worker to Durable Object colo mapping.
	*/
interface ColoField {
	from: ColoFrom;
	to: ColoTo;
}

export type { ColoField, ColoFrom, ColoTo };