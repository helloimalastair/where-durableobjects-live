import type { Expression } from "mapbox-gl";
import type { Feature, FeatureCollection, LineString, Point } from "geojson";

type Coord = [number, number];
type CoordLine = [Coord, Coord];

type BBox = [number, number, number, number];
/*
	* Simplified from Turf.js to only include the center/distance functions
*/
function center(points: FeatureCollection<Point>): Coord {
  const ext: BBox = [Infinity, Infinity, -Infinity, -Infinity];
  points.features.forEach(({ geometry: { coordinates }}) => {
    if (ext[0] > coordinates[0]) {
      ext[0] = coordinates[0];
    }
    if (ext[1] > coordinates[1]) {
      ext[1] = coordinates[1];
    }
    if (ext[2] < coordinates[0]) {
      ext[2] = coordinates[0];
    }
    if (ext[3] < coordinates[1]) {
      ext[3] = coordinates[1];
    }
  });
  return [(ext[0] + ext[2]) / 2, (ext[1] + ext[3]) / 2];
}
function degreesToRadians(degrees: number): number {
  const radians = degrees % 360;
  return (radians * Math.PI) / 180;
}
function distance(line: CoordLine): number {
  const dLat = degreesToRadians(line[1][1] - line[0][1]);
  const dLon = degreesToRadians(line[1][0] - line[0][0]);
  const lat1 = degreesToRadians(line[0][1]);
  const lat2 = degreesToRadians(line[1][1]);

  const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);

  return Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
// end Turf.js

function maybeInvertMeridian(coordinates: CoordLine): CoordLine {
	const startLng = coordinates[0][0];
	const endLng = coordinates[1][0];
	const newCoordinates = structuredClone(coordinates);
	
	if (endLng - startLng >= 180) {
		newCoordinates[1][0] -= 360;
	} else if (endLng - startLng < 180) {
		newCoordinates[1][0] += 360;
	}
	return distance(newCoordinates) < distance(coordinates) ? newCoordinates : coordinates;
}

const emptyFeatureCollection: FeatureCollection = {
	type: "FeatureCollection",
	features: [],
};

function emptyLineString(from: Coord, to: Coord): Feature<LineString> {
	return {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates: [from, to],
		}
	};
};

const strokeColor = (index: number): Expression => ["let",
	"region",
	["case",
		["has", "regions"], ["at", ["%", index, ["length", ["get", "regions"]]], ["get", "regions"]],
		null
	],
	["case",
		// Regions
		["==", ["var", "region"], "wnam"], "#ffffdd",
		["==", ["var", "region"], "enam"], "#274001",
		["==", ["var", "region"], "sam"], "#828a00",
		["==", ["var", "region"], "weur"], "#f29f05",
		["==", ["var", "region"], "eeur"], "#f25c05",
		["==", ["var", "region"], "apac"], "#d6568c",
		["==", ["var", "region"], "oc"], "#4d8584",
		["==", ["var", "region"], "afr"], "#a62f03",
		["==", ["var", "region"], "me"], "#400d01",
		// Jurisdictions
		["==", ["get", "jurisdiction"], "fedramp"], "#dc2626",
		["==", ["get", "jurisdiction"], "eu"], "#2563eb",
		// DurableObject
		["get", "isDOCapable"], "#fbad41",
		// Worker
		"#0b3675"
	]
];

const dashArraySequence = [
	[0, 4, 3],
	[0.5, 4, 2.5],
	[1, 4, 2],
	[1.5, 4, 1.5],
	[2, 4, 1],
	[2.5, 4, 0.5],
	[3, 4, 0],
	[0, 0.5, 3, 3.5],
	[0, 1, 3, 3],
	[0, 1.5, 3, 2.5],
	[0, 2, 3, 2],
	[0, 2.5, 3, 1.5],
	[0, 3, 3, 1],
	[0, 3.5, 3, 0.5],
];

export { center, emptyFeatureCollection, emptyLineString, strokeColor, dashArraySequence, maybeInvertMeridian };