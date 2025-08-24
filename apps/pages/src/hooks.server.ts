import { dev } from '$app/environment';
import type { Handle } from "@sveltejs/kit";
import type { LiveKV } from "@wdol/types";
import { Mutex } from "async-mutex";

const handle: Handle = async ({ event, resolve }) => {
	if (dev) {
		console.log("Running server hook. Does platform exist?", !!event.platform);
	}
	if (event.platform?.env) {
		const KV = event.platform.env.KV;
		if (KV) {
			const mutex = new Mutex();
			let data: LiveKV | null;
			event.locals.getLive = () =>
				mutex.runExclusive(async () => {
					if (dev && data) {
						console.log("Using cached...");
					} else {
						if (dev) {
							console.log("Getting fresh...");
						}
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

export { handle };
