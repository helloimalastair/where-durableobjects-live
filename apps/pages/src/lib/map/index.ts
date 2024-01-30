import { Map } from "mapbox-gl";
import type MapState from "./types";
import { goto } from "$app/navigation";
import type { GeoJSONSource, Point } from "mapbox-gl";
import type { IATA, StatusField, StatusItem } from "@wdol/types";
import type { FeatureCollection, LineString, Point } from "geojson";
import { center, dashArraySequence, emptyFeatureCollection, emptyLineString, strokeColor, maybeInvertMeridian } from "./utils";

export class MapManager {
	private readonly map: Map;
	private readonly startupPromise: Promise<void>;
	private status: StatusField;
	private interval: number | null = null;
	private loopCounter = 0;
	private dashStep = 0;
	private goDash = false;
	constructor(container: HTMLDivElement, status: StatusField, onLoad: () => void) {
		this.map = new Map({
			accessToken: "pk.eyJ1IjoiYWxhc3RhaXJ0ZWNobm9sb2dpZXMiLCJhIjoiY2xydDh3cjlsMDR3YzJpbjZhMDYwa2s1YyJ9.TieFXO6HlDdXuDFLqHLxNg",
			container,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [0, 0],
			zoom: 1,
		});
		this.status = status;
		this.startupPromise = new Promise(resolve => this.map.on("load", () => {
			onLoad();
			this.init();
			resolve();
		}));
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
			paint: {
				"circle-color": ["case",
					["==", ["get", "status"], "operational"], "#46a46c",
					["==", ["get", "status"], "outage"], "#f38020",
					["==", ["get", "status"], "maintenance"], "#2c7cb0",
					"#a0aec0",
				],
				"circle-stroke-color": strokeColor(0),
				"circle-radius": ["case", 
					["get", "origin"], 8,
					6
				],
				"circle-stroke-width": 3,
			}
		});
		// Events
		this.map.on("click", (e) => {
			const features = this.map.queryRenderedFeatures(e.point, {
				layers: ["colos", "connections"],
			});
			if(!features.length) {
				goto("/colo");
			}
			if(features[0].layer.id === "connections") {
				return;
			}
			const maybeProps = features[0].properties;
			if(!maybeProps) {
				return;
			}
			const { iata } = maybeProps as { iata: IATA };
			if(!iata) {
				return;
			}
			goto(`/colo/${iata}`);
		});
		this.map.on("mouseenter", "colos", () => this.map.getCanvas().style.cursor = "pointer");
		this.map.on("mouseleave", "colos", () => this.map.getCanvas().style.cursor = "");
	}
	private async generateColos(statusData: StatusField) {
		await this.startupPromise;
		const newColos = structuredClone(emptyFeatureCollection) as FeatureCollection<Point>;
		for(const [iata, { status, coords, isDOCapable }] of Object.entries(statusData)) {
			newColos.features.push({
				type: "Feature",
				properties: {
					iata,
					status,
					isDOCapable
				},
				geometry: {
					type: "Point",
					coordinates: coords,
				}
			});
		}
		return newColos;
	}
	private renderBaseMode() {
		(this.map.getSource("colos") as GeoJSONSource).setData(this.generateColos(MapState.statusData));
	}
	private animateDashLine(timestamp: number) {
		if(!this.goDash) {
			return;
		}
		const newStep = Math.floor((timestamp / 50) % dashArraySequence.length);
		if (newStep !== this.dashStep) {
			this.map.setPaintProperty("connections", "line-dasharray", dashArraySequence[this.dashStep]);
			this.dashStep = newStep;
		}
		requestAnimationFrame((ts: number) => this.animateDashLine(ts));
	}
}

export type { default as MapState } from "./types";
