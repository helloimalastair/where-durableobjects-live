import data from "./data.json";
import type { IATA } from "@wdol/types";

const iata: Record<IATA, { name: string, latitude: number, longitude: number }> = data;

export default iata;