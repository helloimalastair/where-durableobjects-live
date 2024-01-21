import type { Status } from "@wdol/shared";
const status = {
	operational: {
		name: "Operational",
		color: "bg-status-operational"
	},
	outage: {
		name: "Re-routed",
		color: "bg-status-outage"
	},
	maintenance: {
		name: "Partially Re-routed",
		color: "bg-status-maintenance"
	},
	unknown: {
		name: "Unknown",
		color: "bg-status-unknown"
	}
} as Record<Status, { name: string, color: string }>;

export { status };