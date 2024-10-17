import papa from "papaparse";
import getRegions from "./regions.ts";
import type { IATA } from "@wdol/types";
import getCountries from "./countries.ts";
import addMissingAirports from "./polyfills.ts";
import { readFileSync, writeFileSync } from "node:fs";

const { parse } = papa;

const regions = await getRegions();
const countries = await getCountries();

interface Parsed {
	latitude_deg: string,
	longitude_deg: string,
	iso_country: string,
	iso_region: string,
	municipality: string,
	iata_code: string,
}

const raw = readFileSync("data/airports.csv", "utf8");

const data = (parse(raw, { header: true, skipEmptyLines: "greedy" })).data as unknown as Parsed[];

if(!data || data.length === 0) {
	throw new Error("Something's wrong, I can feel it...");
}

interface Clean {
	name: string,
	latitude: number,
	longitude: number,
}
const clean: Record<IATA, Clean> = {};
export type { clean };

for(const result of data) {
	if(!result.iata_code) continue;
	let name = `${result.municipality}, `;
	const region = regions[result.iso_region];
	if(region){
		name += `${region}, `;
	} else if(!/[A-Z]{2}-U-A/.test(result.iso_region)) {
		throw new Error(`Region not found: ${result.iso_region}`);
	}
	name += countries[result.iso_country];
	
	clean[result.iata_code] = {
		name,
		latitude: Number.parseFloat(result.latitude_deg),
		longitude: Number.parseFloat(result.longitude_deg),
	};
}
addMissingAirports(clean);
writeFileSync("src/data.json", JSON.stringify(clean, null, '\t'));