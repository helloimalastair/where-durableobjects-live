import type { IATA } from "..";
export interface IATAField {
	[iata: IATA]: string;
}