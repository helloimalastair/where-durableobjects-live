import poly from "./poly.json";
import type { Status } from "@wdol/shared";
export default async function(env: Environment, status: Record<string, {
	fullName?: string;
	status: Status;
	isDOCapable: boolean;
}>) {
	const geocode = (await env.KV.get("geocode", "json") ?? poly) as Record<string, { location: string, coords: [number, number] }>;
	return (await Promise.all(Object.entries(status).map(async ([iata, data]) => {
		let resolved = geocode[iata];
		if(!resolved) {
			const url = new URL("https://photon.komoot.io/api/?limit=1");
			url.searchParams.set("q", data.fullName || iata + " Airport");
			const result = (await (await fetch(url, {
				headers: {
					"user-agent": "WhereDurableObjectsLive GeoResolver"
				}
			})).json<{ features: [{geometry: { coordinates: [number, number]}, properties: {
				country: string, city: string
			}}]}>()).features[0];
			resolved = {
				location: `${result.properties.city}, ${result.properties.country}`,
				coords: result.geometry.coordinates,
			};
			geocode[iata] = resolved;
		}
		await env.KV.put("geocode", JSON.stringify(geocode));
		return {
			iata,
			status: data.status,
			isDOCapable: data.isDOCapable,
			...resolved,
		};
	}))).sort((a, b) => a.location.localeCompare(b.location));
}