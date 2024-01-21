import { error } from "@sveltejs/kit";
import type { IATAKV } from "@wdol/types";
import { binding } from "cf-bindings-proxy";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ platform }) => {
	const KV = binding<KVNamespace>("KV", { fallback: platform?.env! });
	const iata = await KV.get<IATAKV>("iata", "json");
	if(!iata) {
		throw error(500, "KV entry not found");
	}
	return {
		colos: Object.fromEntries(Object.entries(iata).map(([code, name]) => [`${name} (${code})`, code] as const))
	};
};

