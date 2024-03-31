import { Mutex } from "async-mutex";
import type { LiveKV } from "@wdol/types";
import { binding } from "cf-bindings-proxy";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	const KV = binding<KVNamespace>("KV", { fallback: event.platform?.env! });
	if(KV) {
		const mutex = new Mutex();
		let data: LiveKV | null;
		event.locals.getLive = () => mutex.runExclusive(async () =>{
			if(data) {
				console.log("Using cached...");
			} else {
				console.log("Getting fresh...");
				data = await KV.get<LiveKV>("live", "json");
				if(!data) {
					throw new Error("KV entry not found");
				}
			}
			return data;
		});
	}
	return resolve(event);
};