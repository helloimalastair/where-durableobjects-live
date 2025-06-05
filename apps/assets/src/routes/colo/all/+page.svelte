<script lang="ts">
	import { goto } from "$app/navigation";
	import { Anchor, Head, BackButton } from "$components";
	import type { PageData } from "./$types";
	export let data: PageData;
</script>
<Head title="All Colos" />
<header>
	<h1 class="font-bold text-5xl">All Colos</h1>
	<Anchor target="/" internal={true} class="italic text-2xl">Where Durable Objects Live</Anchor>
	<BackButton />
</header>
<p class="text-xl">This page displays spawn statistics from every colo to every other colo in a single place.</p>
<table>
	<tr>
		<th class="font-bold w-2/5 border-b-2 py-3">DOs created from:</th>
		<th class="font-bold border-b-2 py-3">Spawn in:</th>
	</tr>
	{#each data.colos as workerColo}
		<tr>
			<td class="py-2"><Anchor target={"/colo/" + workerColo.code} class="hover:text-gray-500" internal={true}>{workerColo.code}</Anchor></td>
			<td class="py-2">
				{#each workerColo.spawnsIn as spawnsIn, i}
					<Anchor target={"/colo/" + spawnsIn.code} class="font-bold" internal={true}>{spawnsIn.code}</Anchor>: {spawnsIn.likelihood}%{#if i < workerColo.spawnsIn.length - 1}{", "}{/if}
				{/each}
			</td>
		</tr>
	{/each}
</table>