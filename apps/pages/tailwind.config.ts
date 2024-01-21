import type { Config } from "tailwindcss";

export default <Config>{
	content: ["./src/**/*.{html,svelte}"],
	theme: {
		extend: {
			colors: {
				"status-operational": "#46a46c",
				"status-outage": "#f38020",
				"status-maintenance": "#2c7cb0",
				"status-unknown": "#a0aec0",
        "region-wnam": "#ffffdd",
        "region-enam": "#274001",
        "region-sam": "#828a00",
        "region-weur": "#f29f05",
        "region-eeur": "#f25c05",
        "region-apac": "#d6568c",
        "region-oc": "#4d8584",
        "region-afr": "#a62f03",
        "region-me": "#400d01",
        "jurisdiction-fedramp": "#dc2626",
        "jurisdiction-eu": "#2563eb",
        "is-durable": "#fbad41",
        "is-worker": "#0b3675",
			}
		},
	},
	safelist: ["bg-status-operational", "bg-status-outage", "bg-status-maintenance", "bg-status-unknown"],
	plugins: [],
}

