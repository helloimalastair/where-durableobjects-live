<script lang="ts">

	import { browser } from "$app/environment";
	import { EU, Anchor, Congress, Head } from "$components";

	export let data;
	let extraColosShown = false;
	
	const showExtraColo = () => extraColosShown = !extraColosShown;
</script>
<Head title={data.colo.name + "(colo) | Where Durable Objects Live"} />
<header>
	<h1 class="font-bold text-5xl">{data.colo.name} ({data.colo.code})</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	{#if browser && window.history.state["sveltekit:index"]}
		<div>
			<button class="text-xl font-bold" on:click={() => window.history.back()}>← Back</button>
		</div>
	{/if}
</header>
<p class="text-xl">Status: <span class={"px-3 rounded-3xl text-xl text-white whitespace-nowrap w-fit " + data.colo.status.color}>{data.colo.status.name}</span></p>
{#if data.dataAvailable}
	<p class="text-xl">Does this colo host Durable Objects? <span class="font-bold">{ data.spawnsHere ? "Yes" : "No"}</span></p>
	{#if data.spawnsHere}
		{#if data.spawnsHere.regions || data.spawnsHere.jurisdiction}
			<p class="text-xl">Durable objects spawned here are within the 
			{#if data.spawnsHere.regions}
				{#each data.spawnsHere.regions as region, index}
					<Anchor target={"/region/" + region.code } internal={true}>{ region.name } ({ region.code })</Anchor>{#if index === data.spawnsHere.regions.length - 2}{#if data.spawnsHere.regions.length > 2},{/if} and{:else if index < data.spawnsHere.regions.length - 1},{/if}
				{/each}region{(data.spawnsHere.regions.length > 1 ? "s" : "") + (data.spawnsHere.jurisdiction ? "" : ".")}
			{/if}
			{#if data.spawnsHere.regions && data.spawnsHere.jurisdiction}
				and the
			{/if}
			{#if data.spawnsHere.jurisdiction === "eu"}
				<Anchor class="px-3 rounded-3xl text-xl text-white bg-blue-600 whitespace-nowrap" target={"/jurisdiction/" + data.spawnsHere.jurisdiction} internal={true}>
					<EU />
					European Union
				</Anchor>
				jurisdiction.
			{:else if data.spawnsHere.jurisdiction === "fedramp"}
				<Anchor class="px-3 rounded-3xl text-xl text-white bg-red-600 whitespace-nowrap" target={"/jurisdiction/" + data.spawnsHere.jurisdiction} internal={true}>
					<Congress />
					FedRAMP
				</Anchor>
				jurisdiction.
			{/if}
		</p>
		{/if}
		{#if data.spawnsHere.from}
			<div>
				<p class="text-xl">Durable Objects that spawn here could originate from:</p>
				<div class="flex flex-wrap">
					{#each data.spawnsHere.from.slice(0, extraColosShown ? undefined : 3) as colo}
						<Anchor class="px-3 py-1 m-1 rounded-3xl text-xl text-white bg-orange-700 hover:bg-orange-500" target={"/colo/" + colo.code} internal={true}>
							{colo.name} ({colo.code})
						</Anchor>
					{/each}
					{#if data.spawnsHere.from.length > 3}
						<button class="m-1 text-xl text-sky-600 hover:text-sky-400 underline" on:click={showExtraColo}>
							{#if extraColosShown}
								Show Less
							{:else}
								+{data.spawnsHere.from.length - 3} more
							{/if}
						</button>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
	{#if data.regions}
		<div>
			<p class="mt-5 text-xl">What region is fastest to respond here?</p>
			<ol class="mt-2 list-decimal list-inside">
				{#each data.regions as region}
					<li class="text-xl"><Anchor target={"/region/" + region.code} internal={true}>{region.name} ({region.code})</Anchor>: 
						{#if region.latency >= 1e3}
							<span class="font-bold">{Math.floor(region.latency / 10) / 100} s.</span>
						{:else}
							<span class="font-bold">{region.latency} ms.</span>
						{/if}
					</li>
				{/each}
			</ol>
		</div>
	{/if}
	{#if data.to && data.to.length > 0}
		<div>
			<p class="mt-5 text-xl">When you create a Durable Object Here, it can spawn in:</p>
			<div class="flex flex-wrap gap-5">
				{#each data.to as colo}
					<div>
						<Anchor class="text-sky-500 hover:text-sky-300 text-xl" target={"/colo/" + colo.code} internal={true}>{colo.name} ({colo.code})</Anchor>
						<ul class="text-md">
							<li>Latency: {colo.latency} ms.</li>
							<li>Likelihood: {colo.likelihood}%</li>
						</ul>
					</div>
				{/each}
			</div>
		</div>
	{/if}
{:else if data.colo.status.name !== "Operational"}
	<p class="mt-5 text-xl">This colo currently appears to be offline. Please come back later.</p>
{:else if data.colo.name.includes("China")}
	<p class="mt-5 text-xl">This colo appears to be in China. Running Workers(and therefore Durable Objects) requires an <Anchor class="text-sky-500 hover:text-sky-300" target="https://en.wikipedia.org/wiki/ICP_license">ICP license</Anchor>, which this account does not have.</p>
{/if}