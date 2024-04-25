import iata from "@wdol/iata";
import type { Status } from "@wdol/shared";
import { analyticsEngineQuery } from "./utils";
import type { ServingColoSQLResponse, StatusField, IATAField } from "@wdol/types";

interface StatuspageComponents {
	components: {
		name: string,
		status: string,
	}[]
}

const statusMapping = new Map<string, Status>(Object.entries({
	operational: "operational",
	partial_outage: "outage",
	under_maintenance: "maintenance",
}));

export default async function(env: Environment): Promise<{ status: StatusField, iata: IATAField }> {
	const { components } = await (await fetch("https://www.cloudflarestatus.com/api/v2/components.json")).json<StatuspageComponents>();
	const status: StatusField = {};
	for(const component of components) {
		const maybeIata = /([A-Za-z,\s]+)\s+-\s+\(([A-Z]{3})\)$/.exec(component.name);
		if(maybeIata) {
			try {
				const airport = iata[maybeIata[2]];
				status[maybeIata[2]] = {
					name: airport.name,
					coords: [airport.longitude, airport.latitude],
					status: statusMapping.get(component.status) ?? "unknown",
					isDOCapable: false,
				};
			} catch(_) {
				console.error(`Failed to find IATA code ${maybeIata[2]}`);
			}
		}
	}
	const [{ data: workerColos }, { data: doColos }] = (await analyticsEngineQuery<[ServingColoSQLResponse, ServingColoSQLResponse]>(["SELECT blob1 as colo FROM WDL WHERE timestamp > NOW() - INTERVAL '5' MINUTE AND NOT isEmpty(blob1) GROUP BY blob1", "SELECT index1 as colo FROM WDL WHERE timestamp > NOW() - INTERVAL '5' MINUTE AND NOT isEmpty(index1) GROUP BY index1"], env.API_TOKEN));
	for(const { colo } of workerColos) {
		if(!status[colo]) {
			const airport = iata[colo];
			status[colo] = {
				name: airport.name,
				coords: [airport.longitude, airport.latitude],
				status: "unknown",
				isDOCapable: false,
			};
		}
	}
	for(const { colo } of doColos) {
		if(status[colo]) {
			status[colo].isDOCapable = true;
		}
	}
	return {status, iata: Object.entries(status).sort((a, b) => a[1].name.localeCompare(b[1].name)).reduce((acc, [iata, { name }]) => {
		acc[iata] = name;
		return acc;
	}, {} as IATAField)};
}