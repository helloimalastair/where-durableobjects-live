<script lang="ts">
import { Anchor, Head, BackButton } from "$components";
import type { PageData } from "./$types";

export let data: PageData;
</script>
<Head title={data.region.name + " (region)"} />
<header>
	<h1 class="font-bold text-5xl">{data.region.name} ({data.region.code})</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	<BackButton />
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