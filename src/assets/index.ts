import { Handler } from "hono";
import globePNG from "./globe.png";

const globeCORSHeaders = {
	"access-control-allow-methods": "GET, OPTIONS",
	"access-control-allow-origin": "https://where.durableobjects.live/",
	"access-control-max-age": "86400",
	"cross-origin-resource-policy": "same-origin"
};

const globeOptions: Handler = async () => new Response(null, { status: 204, headers: globeCORSHeaders });

const globe: Handler = () => new Response(globePNG, {
	headers: {
		...globeCORSHeaders,
		"content-type": "image/png"
	}
});
export { globeOptions, globe };