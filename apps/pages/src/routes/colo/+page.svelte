<script lang="ts">
	import iata from "@wdol/iata";
	import { browser } from "$app/environment";
	import { Head, Anchor } from "$components";
	import { goto } from "$app/navigation";
	import MultiSelect from 'svelte-multiselect';

	export let data;

	let selected: string[];
	const navigateToColo = async () => {
		if(selected.length) {
			await goto(`/colo/${data.colos[selected[0]]}`);
		}
	};
</script>
<Head title="Colos | Where Durable Objects Live" />
<header>
	<h1 class="font-bold text-5xl">Colos</h1>
	<Anchor target="/" internal={true} class="italic text-2xl">Where Durable Objects Live</Anchor>
	{#if browser && window.history.state["sveltekit:index"]}
		<div>
			<button class="text-xl font-bold" on:click={() => window.history.back()}>← Back</button>
		</div>
	{/if}
</header>
<p class="text-xl">A colo is one(or more) datacenters in the geographic area of a city. A colo is designated by a 3-letter IATA code, like LHR(London), or DEL(New Delhi). Most colos serve Workers traffic, but only a handful serve Durable Object traffic.</p>
<p class="text-xl">You can use the selector below to see more information about individual colos, their status, and what kind of traffic they serve/generate.</p>
<!-- <div>
	<select on:change={navigateToColo} class="px-5 py-1 w-fit" bind:this={selector}>
		<option value="" selected disabled hidden>Choose a Colo Here</option>
		{#each data.colos as { iata, location }}
			<option value={iata}>{location} ({iata})</option>
		{/each}
	</select>
</div> -->

<MultiSelect maxSelect={1} on:add={navigateToColo} bind:selected options={Object.keys(data.colos)} />