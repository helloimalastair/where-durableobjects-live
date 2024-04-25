import type { Jurisdiction } from "@wdol/shared";
import type { DurableObjectColo } from "..";

export interface JurisdictionSQLResponse {
	data: [
		{
			durable: DurableObjectColo;
			jurisdiction: Jurisdiction;
			count: number;
		},
	];
}
