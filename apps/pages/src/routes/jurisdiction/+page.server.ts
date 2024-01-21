import type { MapState } from "$lib";
import { error } from "@sveltejs/kit";
import type { Jurisdiction } from "@wdol/shared";
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
		mode: "jurisdictions",
		data: Object.entries(live.jurisdiction).reduce((acc, [jurisdiction, colos]) => {
			for(const colo in colos) {
				acc[colo] = jurisdiction as Jurisdiction;
			}
			return acc;
		}, {} as Record<IATA, Jurisdiction>),
	};
	return { map };
};