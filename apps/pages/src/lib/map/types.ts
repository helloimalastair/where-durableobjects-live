import type { WorkerColo } from "@wdol/types";

type MapState = {
	highlightDOs?: false,
	highlight: Set<WorkerColo>;
	resetPosition?: boolean;
	connections?: [WorkerColo, WorkerColo][];
} | {
	highlightDOs: true,
	connections?: never
};

export default MapState;