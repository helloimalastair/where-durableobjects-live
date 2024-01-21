import type { DurableObjectColo } from "..";
import type { Jurisdiction } from "@wdol/shared";

interface JurisdictionSQLResponse {
	data: [{
		durable: DurableObjectColo,
		jurisdiction: Jurisdiction,
		count: number
	}]
}

export type { JurisdictionSQLResponse };