import type { Jurisdiction } from "@wdol/shared";
import type { DurableObjectColo } from "..";

/*
 * Represents the likelihood of a Durable Object colo serving traffic for a given jurisdiction.
 */
export type JurisdictionField = {
	[jurisdiction in Jurisdiction]: {
		[durable: DurableObjectColo]: number;
	};
};
