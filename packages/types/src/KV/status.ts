import type { IATA } from "..";
import type { Status } from "@wdol/shared";

interface StatusItem {
	name: string;
	coords: [number, number];
	status: Status;
	isDOCapable: boolean;
};

interface StatusField {
	[iata: IATA]: StatusItem;
};

export type { StatusItem, StatusField };