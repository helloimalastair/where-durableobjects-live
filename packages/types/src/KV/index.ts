import type { IATA } from "..";
import type { ColoField } from "./colo";
import type { FrontpageField } from "./frontpage";
import type { JurisdictionField } from "./jurisdiction";
import type { RegionField } from "./region";
import type { StatusField } from "./status";

interface LiveKV {
	colo: ColoField,
	frontpage: FrontpageField,
	jurisdiction: JurisdictionField,
	region: RegionField,
	status: StatusField,
	updatedAt: number,
}

interface IATAKV {
	[iata: IATA]: string;
}

export type * from "./frontpage";
export type * from "./colo";
export * from "./jurisdiction";
export * from "./region";
export * from "./status";
export type { LiveKV, IATAKV };