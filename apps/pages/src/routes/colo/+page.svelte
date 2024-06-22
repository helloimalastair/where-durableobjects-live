<script lang="ts">
import { goto } from "$app/navigation";
import { Anchor, Head, BackButton } from "$components";
import MultiSelect from "svelte-multiselect";
import type { PageData } from "./$types";

export let data: PageData;

let selected: string[];
const navigateToColo = async () => {
	if (selected.length) {
		await goto(`/colo/${data.colos[selected[0]]}`);
	}
};
</script>
<Head title="Colos" />
<header>
	<h1 class="font-bold text-5xl">Colos</h1>
	<Anchor target="/" internal={true} class="italic text-2xl">Where Durable Objects Live</Anchor>
	<BackButton />
</header>
<p class="text-xl">A colo is one(or more) datacenters in the geographic area of a city. A colo is designated by a 3-letter IATA code, like LHR(London), or DEL(New Delhi). Most colos serve Workers traffic, but only a handful serve Durable Object traffic.</p>
<p class="text-xl">You can use the selector below to see more information about individual colos, their status, and what kind of traffic they serve/generate.</p>

<MultiSelect maxSelect={1} on:add={navigateToColo} bind:selected options={Object.keys(data.colos)} />

<Anchor target="/colo/all" internal={true} class="underline text-xl">Click here to see all colos at once</Anchor>