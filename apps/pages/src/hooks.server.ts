import type { HandleServerError, Handle } from "@sveltejs/kit";
import type { LiveKV } from "@wdol/types";
import { Mutex } from "async-mutex";
import { Axiom } from "@axiomhq/js";

const handle: Handle = async ({ event, resolve }) => {
	if (event.platform?.env) {
		event.platform.env.AXIOM = new Axiom({
			token: event.platform.env.AXIOM_TOKEN,
			orgId: event.platform.env.AXIOM_ORG_ID,
		});
		const KV = event.platform.env.KV;
		if (KV) {
			const mutex = new Mutex();
			let data: LiveKV | null;
			event.locals.getLive = () =>
				mutex.runExclusive(async () => {
					if (data) {
						console.log("Using cached...");
					} else {
						console.log("Getting fresh...");
						data = await KV.get<LiveKV>("live", "json");
						if (!data) {
							throw new Error("KV entry not found");
						}
					}
					return data;
				});
		}
	}
	return resolve(event);
};

const handleError: HandleServerError = async ({ error, event: { platform }, message }) => {
	if(!(platform?.cf && platform.context)) {
		return console.error("No platform/CF :(");
	}
	const { AXIOM, AXIOM_DATASET } = platform.env;
	AXIOM.ingest(AXIOM_DATASET, {
		error,
		message,
		colo: platform.cf.colo,
	});
	platform.context.waitUntil(AXIOM.flush());
};

export { handle, handleError };