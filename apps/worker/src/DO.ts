export class DO {
	async fetch() {
		return Response.json({
			ts: Date.now(),
			colo: ((
				await (await fetch("https://www.cloudflare.com/cdn-cgi/trace")).text()
			).match(/^colo=(.+)/m) as string[])[1]
		});
	}
}