import type { MapState } from "$lib";
import { error } from "@sveltejs/kit";
import type { Region } from "@wdol/shared";
import { binding } from "cf-bindings-proxy";
import type { PageServerLoad } from "./$types";
import type { IATA, LiveKV } from "@wdol/types";

export const load: PageServerLoad = async ({ platform, depends }) => {
	depends("map:update");
	const KV = binding<KVNamespace>("KV", { fallback: platform?.env! });
	const live = await KV.get<LiveKV>("live", "json");
	if(!live) {
		throw error(500, "KV entry not found");
	}
	const map: MapState = {
		mode: "regions",
		data: Object.entries(live.region.hosts).reduce((acc, [region, colos]) => {
			for(const colo in colos) {
				if(!(colo in acc)) {
					acc[colo] = [];
				}
				acc[colo].push(region as Region);
			}
			return acc;
		}, {} as Record<IATA, Region[]>),
	};
	return { map };
};