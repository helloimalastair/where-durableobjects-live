export class DO {
	async fetch() {
		return new Response(
			((
				await (await fetch("https://www.cloudflare.com/cdn-cgi/trace")).text()
			).match(/^colo=(.+)/m) as string[])[1],
		);
	}
}