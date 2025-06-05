import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ depends, locals }) => {
	depends("data:update");
	const { iata } = await locals.getLive();
	return {
		colos: Object.fromEntries(
			Object.entries(iata).map(
				([code, name]) => [`${name} (${code})`, code] as const,
			),
		),
	};
};
