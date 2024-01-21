<script lang="ts">
	import { browser } from "$app/environment";
	import { regions } from "@wdol/shared";
  import { Anchor, Head } from "$components";
</script>
<Head title="Regions | Where Durable Objects Live" />
<header>
	<h1 class="font-bold text-5xl">Regions</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	{#if browser && window.history.state["sveltekit:index"]}
		<div>
			<button class="text-xl font-bold" on:click={() => window.history.back()}>← Back</button>
		</div>
	{/if}
</header>
<p class="text-xl">
	Regions are a way to spawn a Durable Object in a specific geographic location. This can be useful for reducing latency for users in a specific area.
</p>
<p class="text-xl">
	Note, some regions do not have any colos that serve Durable Object traffic where you would expect them to be. As such, a Durable Object requested in a given region may not be served from a colo in that region(geographically).
</p>
<div class="flex flex-wrap">
	{#each Object.entries(regions) as [code, name]}
		<Anchor class="px-3 py-1 m-1 rounded-3xl text-xl text-white bg-orange-700 hover:bg-orange-500" target={"/region/" + code} internal={true}>{name}</Anchor>
	{/each}
</div>