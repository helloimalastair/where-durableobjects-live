import { analyticsEngineQuery } from "../utils";
import geocode from "./geocode";
import type { IATAKV, ServingColoSQLResponse, StatusField } from "@wdol/types";
import type { Status } from "@wdol/shared";

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

export default async function(env: Environment): Promise<StatusField> {
	const { components } = await (await fetch("https://www.cloudflarestatus.com/api/v2/components.json")).json<StatuspageComponents>();
	const status: Record<string, { fullName?: string, status: Status, isDOCapable: boolean }> = {};
	for(const component of components) {
		const maybeIata = /([A-Za-z,\s]+)\s+-\s+\(([A-Z]{3})\)$/.exec(component.name);
		if(maybeIata) {
			status[maybeIata[2]] = {
				fullName: component.name,
				status: statusMapping.get(component.status) ?? "unknown",
				isDOCapable: false,
			};
		}
	}
	const [{ data: workerColos }, { data: doColos }] = (await analyticsEngineQuery<[ServingColoSQLResponse, ServingColoSQLResponse]>(["SELECT blob1 as colo FROM WDL WHERE timestamp > NOW() - INTERVAL '5' MINUTE AND NOT isEmpty(blob1) GROUP BY blob1", "SELECT index1 as colo FROM WDL WHERE timestamp > NOW() - INTERVAL '5' MINUTE AND NOT isEmpty(index1) GROUP BY index1"], env.API_TOKEN));
	for(const { colo } of workerColos) {
		if(!status[colo]) {
			status[colo] = {
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
	const data = await geocode(env, status);
	await env.KV.put("iata", JSON.stringify(data.reduce((acc, { iata, location }) => {
		acc[iata] = location;
		return acc;
	}, {} as IATAKV)));
	return data.reduce((acc, { iata, ...rest }) => {
		acc[iata] = rest;
		return acc;
	}, {} as StatusField);
}