import type { Region } from "@wdol/shared";
import type { DurableObjectColo, WorkerColo } from "..";

type RegionHosts = {
	[region in Region]: {
		[durable in DurableObjectColo]: number;
	};
};

type RegionLatency = {
	[colo: WorkerColo]: {
		code: Region;
		latency: number;
	}[];
};
/*
	* Represents the likelihood of a Durable Object colo serving traffic for a given region.
	*/
type RegionField = {
	hosts: RegionHosts;
	latency: RegionLatency;
};

export type { RegionField, RegionHosts, RegionLatency };