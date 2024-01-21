import scheduled from "./cron";

export default <ExportedHandler<Environment>> {
	async fetch(_, env, ctx) {
		await scheduled({} as ScheduledController, env, ctx);
		return new Response("OK");
	},
	scheduled,
};
export { DO } from "./DO";