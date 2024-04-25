import type { MapState } from "$lib";
import { error } from "@sveltejs/kit";
import { type Region, regions } from "@wdol/shared";
import type { DurableObjectColo, IATA } from "@wdol/types";
import type { PageServerLoad } from "./$types";

const guard = (key: string): key is Region => key in regions;

export const load: PageServerLoad = async ({ depends, params, locals }) => {
	depends("data:update");
	if (!guard(params.code)) {
		throw error(404, "Not Found");
	}
	const { region, iata } = await locals.getLive();
	const map: MapState = {
		highlight: Object.keys(region.hosts[params.code]).reduce((acc, colo) => {
			acc.add(colo as IATA);
			return acc;
		}, new Set<DurableObjectColo>()),
	};
	return {
		map,
		region: {
			code: params.code,
			name: regions[params.code],
		},
		serves: Object.entries(region.hosts[params.code])
			.map(([durable, likelihood]) => ({
				code: durable,
				name: iata[durable],
				likelihood,
			}))
			.sort((a, b) => b.likelihood - a.likelihood),
	};
};
