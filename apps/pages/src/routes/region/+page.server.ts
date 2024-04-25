import type { MapState } from "$lib";
import type { DurableObjectColo, IATA } from "@wdol/types";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends("data:update");
	const { region } = await locals.getLive();
	const map: MapState = {
		highlight: Object.entries(region.hosts).reduce((acc, [_, colos]) => {
			for (const colo in colos) {
				acc.add(colo as IATA);
			}
			return acc;
		}, new Set<DurableObjectColo>()),
		resetPosition: true,
	};
	return { map };
};
