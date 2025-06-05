import { genData } from "$lib";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ depends, platform, locals }) => {
	depends("data:update");
	const { frontpage, iata } = await locals.getLive();
	const spawnData = await genData(platform);
	const { city, worker, durable } = spawnData || {
		city: "Vadum",
		worker: "Copenhagen (CPH)",
		durable: "Frankfurt (FRA)",
	};
	return {
		city,
		worker: `${iata[worker]} (${worker})`,
		durable: `${iata[durable]} (${durable})`,
		coverage: frontpage.coverage,
		hourly: frontpage.hourly,
	};
};
