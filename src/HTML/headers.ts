export default function (nonce?: string) {
	return {
		"access-control-allow-methods": "GET, OPTIONS",
		"access-control-allow-origin": "https://where.durableobjects.live",
		"access-control-max-age": "86400",
		"content-security-policy": `default-src 'none'; script-src 'none'; style-src '${ nonce ? `nonce-${nonce}` : "none" }'; img-src 'self'; font-src 'none'; connect-src 'self' https://jed.is/ https://goalastair.com/ https://github.com/ https://developers.cloudflare.com/ https://workers.cloudflare.com/; media-src 'none'; object-src 'none'; child-src 'none'; frame-src 'none'; worker-src 'none'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests; block-all-mixed-content; sandbox allow-same-origin allow-popups; base-uri 'none'; manifest-src 'none'`,
		"cross-origin-embedder-policy": "require-corp",
		"cross-origin-opener-policy": "same-origin",
		"cross-origin-resource-policy": "same-origin",
		"permissions-policy": "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()",
		"referrer-policy": "no-referrer",
		"strict-transport-security": "max-age=31536000",
		"x-content-type-options": "nosniff",
		"x-frame-options": "DENY"
	};
};