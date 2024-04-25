import type { MapState } from "$lib";
import type { DurableObjectColo, IATA } from "@wdol/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ depends, locals }) => {
	depends("data:update");
	const live = await locals.getLive();
	const map: MapState = {
		highlight: Object.entries(live.jurisdiction).reduce((acc, [_, colos]) => {
			for (const colo in colos) {
				acc.add(colo as IATA);
			}
			return acc;
		}, new Set<DurableObjectColo>()),
	};
	return { map };
};
