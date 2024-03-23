import type { DurableObjectColo } from "..";
import type { Jurisdiction } from "@wdol/shared";

export interface JurisdictionSQLResponse {
	data: [{
		durable: DurableObjectColo,
		jurisdiction: Jurisdiction,
		count: number
	}]
};