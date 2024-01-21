import { error } from "@sveltejs/kit";
import { binding } from "cf-bindings-proxy";
import type { PageServerLoad } from "./$types";
import type { LiveKV, IATAKV, IATA } from "@wdol/types";
import { regions, type Region } from "@wdol/shared";
import type { MapState } from "$lib";

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
		mode: "regions",
		data: Object.entries(live.region.hosts).reduce((acc, [region, colos]) => {
			if(region !== params.code) {
				return acc;
			}
			for(const colo in colos) {
				acc[colo] = [region as Region];
			}
			return acc;
		}, {} as Record<IATA, Region[]>),
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

