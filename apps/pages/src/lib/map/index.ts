import { goto } from "$app/navigation";
import type { IATA, StatusField } from "@wdol/types";
import type { FeatureCollection, Geometry } from "geojson";
import mapboxgl from "mapbox-gl";
import type { GeoJSONSource } from "mapbox-gl";
import type MapState from "./types";
import {
	type Coord,
	bbox,
	dashArraySequence,
	emptyFeatureCollection,
	emptyLineString,
	maybeInvertMeridian,
} from "./utils";

export class MapManager {
	private readonly map: mapboxgl.Map;
	private readonly startupPromise: Promise<void>;
	private dashStep = 0;
	private goDash = false;
	constructor(container: HTMLDivElement, onLoad: () => void) {
		this.map = new mapboxgl.Map({
			accessToken:
				"pk.eyJ1IjoiYWxhc3RhaXJ0ZWNobm9sb2dpZXMiLCJhIjoiY2xzaGd1bm94MXR6azJpcGNwM3JsM2szbiJ9.hksk8vj03uRgjzwsZDfttw",
			container,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [0, 0],
			zoom: 1,
		});
		this.startupPromise = new Promise((resolve) =>
			this.map.on("load", () => {
				onLoad();
				this.init();
				resolve();
			}),
		);
	}
	init() {
		// Connections
		this.map.addSource("connections", {
			type: "geojson",
			data: structuredClone(emptyFeatureCollection),
		});
		this.map.addLayer({
			type: "line",
			source: "connections",
			id: "connections",
			paint: {
				"line-color": "black",
				"line-width": 3,
				"line-dasharray": [0, 4, 3],
			},
		});
		// Colos
		this.map.addSource("colos", {
			type: "geojson",
			data: structuredClone(emptyFeatureCollection),
		});
		this.map.addLayer({
			id: "colos",
			type: "circle",
			source: "colos",
			layout: {
				"circle-sort-key": ["case", ["get", "highlight"], 2, 1],
			},
			paint: {
				"circle-color": [
					"case",
					["==", ["get", "status"], "operational"],
					"#46a46c",
					["==", ["get", "status"], "outage"],
					"#f38020",
					["==", ["get", "status"], "maintenance"],
					"#2c7cb0",
					"#a0aec0",
				],
				"circle-stroke-color": [
					"case",
					// Durable
					["get", "isDOCapable"],
					"#fbad41",
					// Worker
					"#0b3675",
				],
				"circle-radius": ["case", ["get", "origin"], 8, 6],
				"circle-stroke-width": 3,
				"circle-opacity": ["case", ["get", "highlight"], 1, 0.3],
				"circle-stroke-opacity": ["case", ["get", "highlight"], 1, 0.3],
			},
		});
		// Events
		this.map.on("click", (e) => {
			const features = this.map.queryRenderedFeatures(e.point, {
				layers: ["colos", "connections"],
			});
			if (!features.length) {
				goto("/colo");
			}
			if (features[0].layer.id === "connections") {
				return;
			}
			const maybeProps = features[0].properties;
			if (!maybeProps) {
				return;
			}
			const { iata } = maybeProps as { iata: IATA };
			if (!iata) {
				return;
			}
			goto(`/colo/${iata}`);
		});
		this.map.on("mouseenter", "colos", () => {
			this.map.getCanvas().style.cursor = "pointer";
		});
		this.map.on("mouseleave", "colos", () => {
			this.map.getCanvas().style.cursor = "";
		});
	}
	async render(statusData: StatusField, custom?: MapState) {
		await this.startupPromise;
		const newColos = structuredClone(
			emptyFeatureCollection,
		) as FeatureCollection<Geometry>;
		for (const [iata, { status, coords, isDOCapable }] of Object.entries(
			statusData,
		)) {
			let highlight = false;
			if (!custom) {
				highlight = true;
			} else if (custom?.highlightDOs) {
				highlight = isDOCapable;
			} else if (custom?.highlight.has(iata)) {
				highlight = true;
			}
			newColos.features.push({
				type: "Feature",
				properties: {
					iata,
					status,
					highlight,
					isDOCapable,
				},
				geometry: {
					type: "Point",
					coordinates: coords,
				},
			});
		}
		if (custom?.connections) {
			(this.map.getSource("connections") as GeoJSONSource).setData({
				type: "FeatureCollection",
				features: custom.connections.map(([from, to]) => {
					const line = maybeInvertMeridian([
						statusData[from].coords,
						statusData[to].coords,
					]);
					return emptyLineString(line);
				}),
			});
			this.goDash = true;
			this.dashStep = 0;
			this.animateDashLine(0);
		} else {
			(this.map.getSource("connections") as GeoJSONSource).setData(
				emptyFeatureCollection,
			);
			this.goDash = false;
		}
		(this.map.getSource("colos") as GeoJSONSource).setData(newColos);
	}
	async flyTo(statusData: StatusField, custom?: MapState) {
		await this.startupPromise;
		if (!custom || custom.highlightDOs) {
			return;
		}
		if (custom.resetPosition) {
			this.map.flyTo({
				center: [0, 0],
				zoom: 1,
			});
			return;
		}
		const coordArr: Coord[] = [];
		for (const [iata, { coords }] of Object.entries(statusData)) {
			if (custom.highlight.has(iata)) {
				coordArr.push(coords);
			}
		}
		if (!coordArr.length) {
			return;
		}
		const [one, two, three, four] = bbox(coordArr);
		const box = maybeInvertMeridian([
			[three, four],
			[one, two],
		]);
		this.map.fitBounds(box);
	}
	private async animateDashLine(timestamp: number) {
		if (!this.goDash) {
			return;
		}
		const newStep = Math.floor((timestamp / 100) % dashArraySequence.length);
		if (newStep !== this.dashStep) {
			this.map.setPaintProperty(
				"connections",
				"line-dasharray",
				dashArraySequence[this.dashStep],
			);
			this.dashStep = newStep;
		}
		requestAnimationFrame((ts: number) => this.animateDashLine(ts));
	}
}

export type { MapState };
