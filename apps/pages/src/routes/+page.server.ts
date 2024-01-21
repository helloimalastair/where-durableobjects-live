import { genData } from "$lib";
import { error } from "@sveltejs/kit";
import type { LiveKV } from "@wdol/types";
import { binding } from "cf-bindings-proxy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
	const KV = binding<KVNamespace>("KV", { fallback: platform?.env! });
	const live = await KV.get<LiveKV>("live", "json");
	if(!live) {
		throw error(500, "KV entry not found");
	}
	const spawnData = await genData(platform);
	const { city, worker, durable } = spawnData || {
		city: "Vadum",
		worker: "Copenhagen (CPH)",
		durable: "Frankfurt (FRA)",
	};
	return {
		city,
		worker,
		durable,
		coverage: live.frontpage.coverage,
		hourly: live.frontpage.hourly,
		dataUpdatedAt: live.updatedAt,
	};
};