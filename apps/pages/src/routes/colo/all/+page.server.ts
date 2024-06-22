import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ depends, locals }) => {
	depends("data:update");
	const { iata, colo: { to } } = await locals.getLive();
	const colos = Object.entries(to).map(([worker, durableColos]) => ({
		code: worker,
		spawnsIn: durableColos.map(({code, likelihood}) => ({
			code,
			likelihood
		})).sort((a, b) => a.code.localeCompare(b.code)),
	})).sort((a, b) => a.code.localeCompare(b.code));
	return {
		colos,
	};
};
