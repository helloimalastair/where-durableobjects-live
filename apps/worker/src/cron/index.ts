import api from "./api";
import colo from "./colo";
import status from "./status";
import regions from "./region";
import frontpage from "./frontpage";
import jurisdiction from "./jurisdiction";
import type { LiveKV } from "@wdol/types";

const cron: ExportedHandlerScheduledHandler<Env> = async (event, env, ctx) => {
	const data = await Promise.all([colo(env), frontpage(env), status(env), regions(env), jurisdiction(env)]);
	const live = {
		colo: data[0],
		frontpage: data[1],
		status: data[2].status,
		iata: data[2].iata,
		region: data[3],
		jurisdiction: data[4],
		updatedAt: Date.now(),
	} as LiveKV;
	await Promise.all([env.KV.put("live", JSON.stringify(live)),
		api(live, env)
	]);
};

export default cron;