import papa from "papaparse";
import { readFileSync } from "node:fs";

const { parse } = papa;

interface Parsed {
	code: string,
	name: string,
}

export default async function getCountries() {
	const raw = readFileSync("data/countries.csv", "utf8");
	return ((parse(raw, { header: true, skipEmptyLines: "greedy" })).data as unknown as Parsed[])
		.reduce((acc, { code, name }) => {
			if(!code || !name || name === "Unknown or unassigned country") return acc;
			acc[code] = name;
			return acc;
		}, {} as Record<string, string>);
}