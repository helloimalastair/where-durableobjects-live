import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ depends, locals }) => {
	depends("data:update");
	const data = await locals.getLive();
	return { colos: data.status, updatedAt: data.updatedAt };
};
