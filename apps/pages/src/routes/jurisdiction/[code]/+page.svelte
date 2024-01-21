<script lang="ts">
	import { browser } from "$app/environment";
  import { Head } from "$components";
  import Anchor from "$components/Anchor.svelte";

	export let data;
</script>
<Head title={data.jurisdiction.name + "(jurisdiction) | Where Durable Objects Live"} />
<header>
	<h1 class="font-bold text-5xl">{data.jurisdiction.name}</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	{#if browser && window.history.state["sveltekit:index"]}
		<div>
			<button class="text-xl font-bold" on:click={() => window.history.back()}>← Back</button>
		</div>
	{/if}
</header>
{#if data.jurisdiction.code === "eu"}
<p class="mt-5 text-xl">This jurisdiction can be used to ensure compliance with the data storage requirements of the European Union's <Anchor target="https://gdpr.eu/">General Data Protection Regulation</Anchor>. Note though that utilizing this jurisdicition does not ensure compliance of the GDPR as a whole.</p>
{:else}
<p class="mt-5 text-xl">This jurisdiction can be used to ensure Durable Objects are spawned within <Anchor target="https://www.fedramp.gov/">FedRAMP</Anchor>-compliant datacenters.</p>
{/if}

<p class="mt-5 text-xl">Colos that serve DO traffic for this jurisdiction:</p>
<div class="flex flex-wrap">
	{#each data.serves as colo}
		<Anchor class="px-3 py-1 m-1 rounded-3xl text-xl text-white bg-orange-700 hover:bg-orange-500" target={"/colo/" + colo.code} internal={true}>
			{colo.name} ({colo.code})
		</Anchor>
	{/each}
</div>