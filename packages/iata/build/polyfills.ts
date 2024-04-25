// This file contains airports with invalid IATA codes
import type { clean } from ".";
export default function addMissingAirports(cleaned: typeof clean) {
	cleaned.TXL = {
		name: "Berlin, Germany",
		latitude:  52.559700,
		longitude: 13.287700
	};
	cleaned.KIV = {
		name: "Chișinău, Moldova",
		latitude: 46.927700,
		longitude: 28.930999
	};
	cleaned["SFO-DOG"] = {
		name: "San Frandoggo, California, United States",
		latitude: 37.77702296281929,
		longitude: -122.42400224646045,
	};
}