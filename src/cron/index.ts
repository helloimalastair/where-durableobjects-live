import getColos from "./colos";
import getHourly from "./hourly";
import getCoverage from "./coverage";

const scheduled: ExportedHandlerScheduledHandler<Environment> =
	async (_, env) => {
		const colos = await getColos(env);
		await env.KV.put("wdl", JSON.stringify({
			hourly: await getHourly(env),
			coverage: getCoverage(colos),
			colos,
		}));
	};
export default scheduled;