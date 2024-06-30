import { parse } from "papaparse";

interface Parsed {
	code: string,
	name: string,
}

const filter = /\((city|town|capital city|municipality|federal territory|autonomous district|community|capital district|autonomous city|national capital territory|special city|autonomous territorial unit|administrative territorial units|provincial municipality|district|state|area outside territorial authority|oil platforms|special administrative area|autonomous republic)\)/gi;

export default async function getRegions() {
	const raw = await Bun.file("data/regions.csv").text();
	return ((parse(raw, { header: true, skipEmptyLines: "greedy" })).data as unknown as Parsed[])
	.reduce((acc, { code, name }) => {
		if(!code ||
			!name ||
			name.startsWith("(unassigned)")
		) return acc;
		acc[code] = name.replaceAll(filter, "").trim();
		return acc;
	}, {} as Record<string, string>);
}