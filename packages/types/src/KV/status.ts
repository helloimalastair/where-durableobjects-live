import type { IATA } from "..";
import type { Status } from "@wdol/shared";

interface StatusItem {
	location: string;
	coords: [number, number];
	status: Status;
	isDOCapable: boolean;
};

interface StatusField {
	[iata: IATA]: StatusItem;
};

export type { StatusItem, StatusField };