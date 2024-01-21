<script lang="ts">
	import { browser } from "$app/environment";
  import { Anchor, Head } from "$components";

	export let data;
</script>
<Head title={data.region.name + "(region) | Where Durable Objects Live"} />
<header>
	<h1 class="font-bold text-5xl">{data.region.name} ({data.region.code})</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	{#if browser && window.history.state["sveltekit:index"]}
		<div>
			<button class="text-xl font-bold" on:click={() => window.history.back()}>← Back</button>
		</div>
	{/if}
</header>
{#if data.serves}
	<p class="text-xl">When you ask for a Durable Object in this region, it can spawn in:</p>
	<ol class="list-decimal list-inside">
		{#each data.serves as colo}
			<li class="text-xl">
				<Anchor class="text-sky-500" target={"/colo/" + colo.code} internal={true}>{colo.name} ({colo.code})</Anchor>: {colo.likelihood}% likelihood
			</li>
		{/each}
		</ol>
{/if}