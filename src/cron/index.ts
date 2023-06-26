import getColos from "./colos";
import getHourly from "./hourly";
import v1Compat from "./v1Compat";
import getCoverage from "./coverage";

const scheduled: ExportedHandlerScheduledHandler<Environment> =
	async (_, env) => {
		const colos = await getColos(env);
		const hourly =await getHourly(env);
		const coverage = getCoverage(colos);
		await Promise.all([
			env.KV.put("wdl-v2", JSON.stringify({
				hourly,
				coverage,
				colos,
			})),
			env.KV.put("wdl-v1", JSON.stringify({
				hourly,
				coverage,
				colos: v1Compat(colos),
			}))
		]);
	};
export default scheduled;