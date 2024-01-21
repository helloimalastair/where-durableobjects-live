import { Map } from "mapbox-gl";
import type MapState from "./types";
import { goto } from "$app/navigation";
import type { GeoJSONSource } from "mapbox-gl";
import type { IATA, StatusField, StatusItem } from "@wdol/types";
import type { FeatureCollection, LineString, Point } from "geojson";
import { center, dashArraySequence, emptyFeatureCollection, emptyLineString, strokeColor } from "./utils";

export class MapManager {
	private readonly map: Map;
	private readonly startupPromise: Promise<void>;
	private interval: number | null = null;
	private loopCounter = 0;
	private dashStep = 0;
	private goDash = false;
	constructor(container: HTMLDivElement, onLoad: () => void) {
		this.map = new Map({
			accessToken: "pk.eyJ1IjoiYWxhc3RhaXJ0ZWNobm9sb2dpZXMiLCJhIjoiY2xydDh3cjlsMDR3YzJpbjZhMDYwa2s1YyJ9.TieFXO6HlDdXuDFLqHLxNg",
			container,
			style: "mapbox://styles/mapbox/streets-v11",
			center: [0, 0],
			zoom: 1,
		});
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
		this.map.on("click", "colos", (e) => {
			const maybeColo = e.features;
			if(!maybeColo) {
				return;
			}
			const maybeProps = maybeColo[0].properties;
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
	async render(statusData: StatusField, state: MapState) {
		await this.startupPromise;
		const newColos = structuredClone(emptyFeatureCollection) as FeatureCollection<Point>;
		if(state.mode !== "regions") {
			clearInterval(this.interval);
			this.interval = null;
		}
		if(state.mode !== "colo") {
			this.goDash = false;
			(this.map.getSource("connections") as GeoJSONSource).setData(structuredClone(emptyFeatureCollection));
		}
		switch(state.mode) {
			case "regions": {
				for(const [iata, { status }] of Object.entries(statusData) as [IATA, StatusItem][]) {
					if(!state.data[iata]) {
						continue;
					}
					newColos.features.push({
						type: "Feature",
						properties: {
							iata,
							status,
							regions: state.data[iata],
						},
						geometry: {
							type: "Point",
							coordinates: statusData[iata].coords,
						}
					});
				}
				this.interval = setInterval(() => this.map.setPaintProperty("colos", "circle-stroke-color", strokeColor(++this.loopCounter)), 2e3) as unknown as number;
				// Typecast required as something is importing node types
				break;
			}
			case "jurisdictions": {
				for(const [iata, { status }] of Object.entries(statusData) as [IATA, StatusItem][]) {
					const jurisdiction = state.data[iata];
					if(!jurisdiction) {
						continue;
					}
					newColos.features.push({
						type: "Feature",
						properties: {
							iata,
							status,
							jurisdiction,
						},
						geometry: {
							type: "Point",
							coordinates: statusData[iata].coords,
						}
					});
				}
				break;
			}
			case "colo": {
				const originCoords = statusData[state.data.origin].coords;
				const connections = structuredClone(emptyFeatureCollection) as FeatureCollection<LineString>;
				for(const [iata, { status, coords, isDOCapable }] of Object.entries(statusData)) {
					if(state.data.producers[iata]) {
						if(state.data.origin !== iata) {
							connections.features.push(emptyLineString(statusData[iata].coords, originCoords));
						}
					} else if(state.data.consumers[iata]) {
						if(state.data.origin !== iata) {
							connections.features.push(emptyLineString(originCoords, statusData[iata].coords));
						}
					} else if(state.data.origin !== iata) {
						continue;
					}
					newColos.features.push({
						type: "Feature",
						properties: {
							iata,
							status,
							origin: state.data.origin === iata,
							isDOCapable,
						},
						geometry: {
							type: "Point",
							coordinates: coords,
						}
					});
				}
				(this.map.getSource("connections") as GeoJSONSource).setData(connections);
				this.goDash = true;
				this.dashStep = 0;
				this.animateDashLine(0);
				break;
			}
			case "base": {
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
				break;
			}
		}
		this.map.flyTo({
			center: center(newColos),
			essential: true,
			zoom: 2,
		});
		(this.map.getSource("colos") as GeoJSONSource).setData(newColos);
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