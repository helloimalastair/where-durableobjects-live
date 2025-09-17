// This file contains airports with invalid IATA codes
import type { clean } from ".";
export default function addMissingAirports(cleaned: typeof clean) {
	cleaned.TXL = {
		name: "Berlin, Germany",
		latitude: 52.559700,
		longitude: 13.287700
	};
	cleaned.KIV = {
		name: "Chișinău, Moldova",
		latitude: 46.927700,
		longitude: 28.930999
	};
	cleaned.QWJ = {
		name: "Americana, São Paulo, Brazil",
		latitude: -22.755917,
		longitude: -47.269408
	};
	cleaned.JXG = {
		name: "Jiaxing, Zhejiang, China",
		latitude: 30.76341423925632,
		longitude: 120.75557057437169
	};
}
