import type { MapState } from "$lib";
import { status as StatusColors } from "$lib";
import { error, redirect } from "@sveltejs/kit";
import { regions } from "@wdol/shared";
import type { ColoTo, WorkerColo } from "@wdol/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ depends, params, locals }) => {
	depends("data:update");
	const coloCode = params.code;
	if (params.code.match(/[a-z]/g)) {
		throw redirect(301, `/colo/${params.code.toUpperCase()}`);
	}
	if (params.code.length !== 3 && params.code !== "SFO-DOG") {
		throw error(400, "Invalid colo format");
	}
	const { colo, region, iata, status, jurisdiction } = await locals.getLive();
	if(!iata[coloCode]) {
		throw error(404, "Not found");
	}
	if (!colo.to[coloCode]) {
		return {
			map: {
				highlight: new Set<WorkerColo>([coloCode]),
			},
			dataAvailable: false,
			colo: {
				name: iata[coloCode],
				code: coloCode,
				status: StatusColors[status[coloCode].status],
			},
		};
	}
	const related = new Set<WorkerColo>();
	const connections: [WorkerColo, WorkerColo][] = [];
	related.add(coloCode);
	const spawnsHereFrom = colo.from[coloCode]
		? colo.from[coloCode].map((e) => {
				related.add(e);
				connections.push([e, coloCode]);
				return { name: iata[e], code: e };
			})
		: [];
	const spawnsHereRegions = Object.entries(region.hosts).filter(
		([_, colos]) => colos[coloCode],
	) as [keyof typeof regions, Record<string, number>][];
	const spawnsHereJurisdiction = Object.entries(jurisdiction).find(
		([_, colos]) => colos[coloCode],
	);
	let spawnsHere: {
		from?: typeof spawnsHereFrom;
		regions?: {
			name: string;
			code: string;
		}[];
		jurisdiction?: string;
	} | null = null;
	if (
		spawnsHereFrom.length ||
		spawnsHereRegions.length ||
		spawnsHereJurisdiction
	) {
		spawnsHere = {};
		if (spawnsHereFrom.length) {
			spawnsHere.from = spawnsHereFrom;
		}
		if (spawnsHereRegions.length) {
			spawnsHere.regions = spawnsHereRegions.map(([code]) => ({
				name: regions[code],
				code,
			}));
		}
		if (spawnsHereJurisdiction) {
			spawnsHere.jurisdiction = spawnsHereJurisdiction[0];
		}
	}
	const to = colo.to[coloCode].reduce(
		(acc, colo) => {
			related.add(colo.code);
			connections.push([coloCode, colo.code]);
			acc.push({ name: iata[colo.code], ...colo });
			return acc;
		},
		[] as ({ name: string } | ColoTo)[],
	);
	const map: MapState = {
		highlight: related,
		connections,
	};
	return {
		dataAvailable: true,
		colo: {
			name: iata[coloCode],
			code: coloCode,
			status: StatusColors[status[coloCode].status],
		},
		regions: region.latency[coloCode].map((e) => ({
			name: regions[e.code],
			...e,
		})),
		spawnsHere,
		to,
		map,
	};
};
