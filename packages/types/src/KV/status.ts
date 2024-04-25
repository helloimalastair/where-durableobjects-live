import type { Status } from "@wdol/shared";
import type { IATA } from "..";

interface StatusItem {
	name: string;
	coords: [number, number];
	status: Status;
	isDOCapable: boolean;
}

interface StatusField {
	[iata: IATA]: StatusItem;
}

export type { StatusItem, StatusField };
