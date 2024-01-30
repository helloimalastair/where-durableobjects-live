import type { MapState } from "$lib";
import { error } from "@sveltejs/kit";
import { binding } from "cf-bindings-proxy";
import type { PageServerLoad } from "./$types";
import type { DurableObjectColo, IATA, LiveKV } from "@wdol/types";

export const load: PageServerLoad = async ({ platform, depends }) => {
	depends("map:update");
	const KV = binding<KVNamespace>("KV", { fallback: platform?.env! });
	const live = await KV.get<LiveKV>("live", "json");
	if(!live) {
		throw error(500, "KV entry not found");
	}
	const map: MapState = {
		highlight: Object.entries(live.region.hosts).reduce((acc, [_, colos]) => {
			for(const colo in colos) {
				acc.add(colo as IATA);
			}
			return acc;
		}, new Set<DurableObjectColo>()),
	};
	return { map };
};