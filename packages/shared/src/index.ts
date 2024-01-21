const regions = {
	wnam: "Western North America",
	enam: "Eastern North America",
	sam: "South America",
	weur: "Western Europe",
	eeur: "Eastern Europe",
	apac: "Asia-Pacific",
	oc: "Oceania",
	afr: "Africa",
	me: "Middle East"
} as const;

const jurisdictions = {
	fedramp: "FedRAMP",
	eu: "European Union"
} as const;

const statuses = [
	"operational",
	"outage",
	"maintenance",
	"unknown",
] as const;

export { regions, jurisdictions, statuses };

type Region = keyof typeof regions;
type Jurisdiction = keyof typeof jurisdictions;
type Status = typeof statuses[number];

export type { Region, Jurisdiction, Status };