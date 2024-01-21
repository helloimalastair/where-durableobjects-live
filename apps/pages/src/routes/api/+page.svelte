<script lang="ts">
	import { browser } from "$app/environment";
  import { Anchor, Head } from "$components";
</script>
<Head title="API | Where Durable Objects Live" />
<header>
	<h1 class="font-bold text-5xl">API</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	{#if browser && window.history.state["sveltekit:index"]}
		<div>
			<button class="text-xl font-bold" on:click={() => window.history.back()}>← Back</button>
		</div>
	{/if}
</header>
<p class="text-xl">
	The WDOL API remains as it was previously, for now. There are two endpoints:
</p>
<ul class="list-disc list-inside text-lg">
	<li><Anchor target="/json" class="underline text-sky-500 hover:text-sky-300">/json</Anchor>: the original</li>
	<li><Anchor target="/v2/json" class="underline text-sky-500 hover:text-sky-300">/v2/json</Anchor>: with latency data</li>
</ul>
<p class="text-xl">
	While the new system exposes region and jurisdiction data, I am still not sure exactly how it should be exposed. I am open to suggestions, and will be discussing this on <Anchor class="text-sky-500 hover:text-sky-300" target="https://discord.gg/cloudflaredev">the Discord</Anchor>. This also applies to the idea of a historical API, which would allow you to see the data, over time.
</p>