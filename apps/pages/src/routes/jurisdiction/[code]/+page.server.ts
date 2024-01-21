import { error } from "@sveltejs/kit";
import { binding } from "cf-bindings-proxy";
import type { PageServerLoad } from "./$types";
import type { IATA, IATAKV, LiveKV } from "@wdol/types";
import { jurisdictions, type Jurisdiction } from "@wdol/shared";
import type { MapState } from "$lib";

const guard = (key: string): key is Jurisdiction => key in jurisdictions;

export const load: PageServerLoad = async ({ params, platform }) => {
	if (!guard(params.code)) {
		throw error(404, "Not Found");
	}
	const KV = binding<KVNamespace>("KV", { fallback: platform?.env! });
	const [live, iata] = await Promise.all([KV.get<LiveKV>("live", "json"), KV.get<IATAKV>("iata", "json")]);
	if(!live) {
		throw error(500, "KV entry not found");
	}
	if(!iata) {
		throw error(500, "KV entry not found");
	}
	const map: MapState = {
		mode: "jurisdictions",
		data: Object.entries(live.jurisdiction).reduce((acc, [jurisdiction, colos]) => {
			if(jurisdiction !== params.code) {
				return acc;
			}
			for(const colo in colos) {
				acc[colo] = jurisdiction as Jurisdiction;
			}
			return acc;
		}, {} as Record<IATA, Jurisdiction>),
	};
	return {
		map,
		jurisdiction: {
			code: params.code,
			name: jurisdictions[params.code],
		},
		serves: Object.entries(live.jurisdiction[params.code]).map(([durable, count]) => ({
			code: durable,
			name: iata[durable],
			count
		})),
		dataUpdatedAt: live.updatedAt,
	};
};

