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
        "is-durable": "#fbad41",
        "is-worker": "#0b3675",
			}
		},
	},
	safelist: ["bg-status-operational", "bg-status-outage", "bg-status-maintenance", "bg-status-unknown"],
	plugins: [],
}

