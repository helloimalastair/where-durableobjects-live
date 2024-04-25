import type { ColoField } from "./colo";
import type { FrontpageField } from "./frontpage";
import type { IATAField } from "./iata";
import type { JurisdictionField } from "./jurisdiction";
import type { RegionField } from "./region";
import type { StatusField } from "./status";

interface LiveKV {
	colo: ColoField;
	frontpage: FrontpageField;
	jurisdiction: JurisdictionField;
	iata: IATAField;
	region: RegionField;
	status: StatusField;
	updatedAt: number;
}

export type * from "./frontpage";
export type * from "./colo";
export * from "./jurisdiction";
export * from "./region";
export * from "./status";
export * from "./iata";
export type { LiveKV };
