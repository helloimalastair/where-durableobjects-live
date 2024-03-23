import { regions } from "@wdol/shared";
import type { ColoTo, LiveKV, WorkerColo } from "@wdol/types";
import { binding } from "cf-bindings-proxy";
import { status, type MapState } from "$lib";
import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ platform, params }) => {
	const coloCode = params.code;
	if(params.code.match(/[a-z]/g)) {
		throw redirect(301, `/colo/${params.code.toUpperCase()}`);
	}
	if(params.code.length !== 3 && params.code !== "SFO-DOG") {
		throw error(400, "Invalid colo format");
	}
	const KV = binding<KVNamespace>("KV", { fallback: platform?.env! });
	const [iata, live] = await Promise.all([KV.get<Record<string, string>>("iata", "json"), KV.get<LiveKV>("live", "json")]);
	if(!iata) {
		throw error(500, "KV iata not found");
	}
	if(!live) {
		throw error(500, "KV entry not found");
	}
	const { colo, region, jurisdiction } = live;
	if(!colo.to[coloCode]) {
		return {
			map: {
				highlight: new Set<WorkerColo>([coloCode]),
			},
			dataAvailable: false,
			colo: {
				name: iata[coloCode],
				code: coloCode,
				status: status[live.status[coloCode].status]
			},
		};
	}
	// const consumers: Record<WorkerColo, true> = {}; 
	const related = new Set<WorkerColo>();
	const connections: [WorkerColo, WorkerColo][] = [];
	related.add(coloCode);
	const spawnsHereFrom = colo.from[coloCode] ? colo.from[coloCode].map(e => {
		related.add(e);
		connections.push([e, coloCode]);
		return { name: iata[e], code: e };
	}) : [];
	const spawnsHereRegions = Object.entries(region.hosts).filter(([_, colos]) => colos[coloCode]) as [keyof typeof regions, Record<string, number>][];
	const spawnsHereJurisdiction = Object.entries(jurisdiction).find(([_, colos]) => colos[coloCode]);
	let spawnsHere: {
		from?: typeof spawnsHereFrom,
		regions?: {
			name: string,
			code: string
		}[],
		jurisdiction?: string
	} | null = null;
	if(spawnsHereFrom.length || spawnsHereRegions.length || spawnsHereJurisdiction) {
		spawnsHere = {};
		if(spawnsHereFrom.length) {
			spawnsHere.from = spawnsHereFrom;
		}
		if(spawnsHereRegions.length) {
			spawnsHere.regions = spawnsHereRegions.map(([code]) => ({ name: regions[code], code }));
		}
		if(spawnsHereJurisdiction) {
			spawnsHere.jurisdiction = spawnsHereJurisdiction[0];
		}
	}
	const to = colo.to[coloCode].reduce((acc, colo) => {
		related.add(colo.code);
		connections.push([coloCode, colo.code]);
		acc.push({ name: iata[colo.code], ...colo });
		return acc;
	}, [] as ({ name: string} | ColoTo)[]);
	const map: MapState = {
		highlight: related,
		connections
	};
	return {
		dataAvailable: true,
		colo: {
			name: iata[coloCode],
			code: coloCode,
			status: status[live.status[coloCode].status]
		},
		regions: region.latency[coloCode].map(e => ({ name: regions[e.code], ...e })),
		spawnsHere,
		to,
		map,
		dataUpdatedAt: live.updatedAt,
	};
};

