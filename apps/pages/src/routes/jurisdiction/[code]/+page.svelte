<script lang="ts">
import { Head } from "$components";
import {Anchor, BackButton} from "$components";
import type { PageData } from "./$types";

export let data: PageData;
</script>
<Head title={data.jurisdiction.name + " (jurisdiction)"} />
<header>
	<h1 class="font-bold text-5xl">{data.jurisdiction.name}</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	<BackButton />
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