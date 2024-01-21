import type { Jurisdiction, Region } from "@wdol/shared";
import type { WorkerColo, DurableObjectColo } from "@wdol/types";

interface RegionMode {
	mode: "regions",
	data: {
		[colo in DurableObjectColo]: Region[]
	}
}

interface JurisdictionMode {
	mode: "jurisdictions",
	data: {
		[colo in DurableObjectColo]: Jurisdiction
	}
}

interface ColoMode {
	mode: "colo",
	data: {
		origin: WorkerColo,
		consumers: {
			[colo: WorkerColo]: true
		}
		producers: {
			[colo: DurableObjectColo]: true
		}
	}
}

interface BaseMode {
	mode: "base"
}

type MapState = RegionMode | JurisdictionMode | ColoMode | BaseMode;

export default MapState;