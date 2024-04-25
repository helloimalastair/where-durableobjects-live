import type { MapState } from "$lib";
import { error } from "@sveltejs/kit";
import { type Jurisdiction, jurisdictions } from "@wdol/shared";
import type { DurableObjectColo, IATA } from "@wdol/types";
import type { PageServerLoad } from "./$types";

const guard = (key: string): key is Jurisdiction => key in jurisdictions;

export const load: PageServerLoad = async ({ depends, params, locals }) => {
	depends("data:update");
	if (!guard(params.code)) {
		throw error(404, "Not Found");
	}
	const { jurisdiction, iata } = await locals.getLive();
	const map: MapState = {
		highlight: Object.keys(jurisdiction[params.code]).reduce((acc, colo) => {
			acc.add(colo as IATA);
			return acc;
		}, new Set<DurableObjectColo>()),
	};
	return {
		map,
		jurisdiction: {
			code: params.code,
			name: jurisdictions[params.code],
		},
		serves: Object.entries(jurisdiction[params.code]).map(
			([durable, count]) => ({
				code: durable,
				name: iata[durable],
				count,
			}),
		),
	};
};
