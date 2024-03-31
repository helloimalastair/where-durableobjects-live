import { parse } from "papaparse";

interface Parsed {
	code: string,
	name: string,
}

export default async function getCountries() {
	const raw = await Bun.file("data/countries.csv").text();
	return ((parse(raw, { header: true, skipEmptyLines: "greedy" })).data as unknown as Parsed[])
		.reduce((acc, { code, name }) => {
			if(!code || !name || name === "Unknown or unassigned country") return acc;
			acc[code] = name;
			return acc;
		}, {} as Record<string, string>);
}