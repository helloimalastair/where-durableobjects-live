import type { Feature, FeatureCollection, LineString, Point } from "geojson";

type Coord = [number, number];
type CoordLine = [Coord, Coord];

type BBox = [number, number, number, number];
/*
	* Simplified from Turf.js to only include the center/bbox(modified) function
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
function bbox(geojson: Coord[]): BBox {
  const result: BBox = [Infinity, Infinity, -Infinity, -Infinity];
  for(const coord of geojson) {
    if (result[0] > coord[0]) {
      result[0] = coord[0];
    }
    if (result[1] > coord[1]) {
      result[1] = coord[1];
    }
    if (result[2] < coord[0]) {
      result[2] = coord[0];
    }
    if (result[3] < coord[1]) {
      result[3] = coord[1];
    }
  };
	// Multiplier to add buffer space
	result[0] -= 1;
	result[1] -= 1;
	result[2] += 1;
	result[3] += 1;
  return result;
}

function crossesAntiMeridian(lon1: number, lon2: number) {
	const absLonDiff = Math.abs(lon1 - lon2);
	// Check if longitudes have different signs and if their absolute difference is greater than 180 degrees
	if ((lon1 * lon2 < 0) && (absLonDiff > 180)) {
			return true; // Line crosses the anti-meridian
	} else {
			return false; // Line does not cross the anti-meridian
	}
}

function maybeInvertMeridian(coordinates: CoordLine): CoordLine {
	if(crossesAntiMeridian(coordinates[0][0], coordinates[1][0])) {
		const newCoords = structuredClone(coordinates);
		const startLng = coordinates[0][0];
		const endLng = coordinates[1][0];
		if (endLng - startLng >= 180) {
			newCoords[1][0] -= 360;
		} else if (endLng - startLng < 180) {
			newCoords[1][0] += 360;
		}
		return newCoords;
	}
	return coordinates;
}

const emptyFeatureCollection: FeatureCollection = {
	type: "FeatureCollection",
	features: [],
};

function emptyLineString(coordinates: CoordLine): Feature<LineString> {
	return {
		type: "Feature",
		properties: {},
		geometry: {
			type: "LineString",
			coordinates,
		}
	};
};

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

export { center, emptyFeatureCollection, emptyLineString, dashArraySequence, maybeInvertMeridian, bbox };
export type { Coord };