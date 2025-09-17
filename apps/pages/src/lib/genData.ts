import {
	type Jurisdiction,
	type Region,
	jurisdictions,
	regions,
} from "@wdol/shared";
import type { DurableObjectColo } from "@wdol/types";

const URL = "http://wdl";

interface DOJSON {
	ts: number;
	colo: DurableObjectColo;
}

export async function genData(platform: Readonly<App.Platform> | undefined) {
	if (!platform || !platform.cf || !platform.context) {
		return;
	}
	const {
		env: { DO, AE },
		cf: { city, colo: worker },
		context,
	} = platform;
	if (worker.length !== 3) {
		return;
	}
	const start = Date.now();
	const { ts, colo: durable } = await (
		await DO.get(DO.newUniqueId()).fetch(URL)
	).json<DOJSON>();
	if (AE) {
		AE.writeDataPoint({
			blobs: [worker],
			doubles: [ts - start],
			indexes: [durable],
		});
		context.waitUntil(
			(async () => {
				// Region testing
				for (const region of Object.keys(regions) as Region[]) {
					const start = Date.now();
					const { ts, colo: durable } = await (
						await DO.get(DO.newUniqueId(), {
							locationHint: region,
						}).fetch(URL)
					).json<DOJSON>();
					AE.writeDataPoint({
						blobs: [worker, region],
						doubles: [ts - start],
						indexes: [durable],
					});
				}
				// Jurisdiction testing
				for (const jurisdictionName of Object.keys(
					jurisdictions,
				) as Jurisdiction[]) {
					const start = Date.now();
					const jurisdiction = DO.jurisdiction(jurisdictionName);
					const { ts, colo: durable } = await (
						await jurisdiction.get(jurisdiction.newUniqueId()).fetch(URL)
					).json<DOJSON>();
					AE.writeDataPoint({
						blobs: [worker, "", jurisdictionName],
						doubles: [ts - start],
						indexes: [durable],
					});
				}
			})(),
		);
	}
	return {
		city: city as string,
		worker,
		durable,
	};
}
