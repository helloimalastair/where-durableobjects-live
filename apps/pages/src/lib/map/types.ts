import type { WorkerColo } from "@wdol/types";

type MapState = {
	highlightDOs?: false,
	highlight: Set<WorkerColo>;
	connections?: [WorkerColo, WorkerColo][];
} | {
	highlightDOs: true,
	connections?: never
};

export default MapState;