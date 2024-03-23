import { error } from "@sveltejs/kit";
import type { LiveKV } from "@wdol/types";
import { binding } from "cf-bindings-proxy";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ platform, depends }) => {
	depends("map:update");
	const KV = binding<KVNamespace>("KV", { fallback: platform?.env! });
	const data = await KV.get<LiveKV>("live", "json");
	if(!data) {
		throw error(500, "KV entry not found");
	}
	return { colos: data.status, statusUpdatedAt: data.updatedAt };
};