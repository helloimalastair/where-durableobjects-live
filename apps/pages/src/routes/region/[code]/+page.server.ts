import type { MapState } from "$lib";
import { error } from "@sveltejs/kit";
import { binding } from "cf-bindings-proxy";
import type { PageServerLoad } from "./$types";
import { regions, type Region } from "@wdol/shared";
import type { LiveKV, IATAKV, IATA, DurableObjectColo } from "@wdol/types";

const guard = (key: string): key is Region => key in regions;

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
		highlight: Object.keys(live.region.hosts[params.code]).reduce((acc, colo) => {
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
		serves: Object.entries(live.region.hosts[params.code]).map(([durable, likelihood]) => ({
			code: durable,
			name: iata[durable],
			likelihood
		})).sort((a, b) => b.likelihood - a.likelihood),
		dataUpdatedAt: live.updatedAt,
	}
};

