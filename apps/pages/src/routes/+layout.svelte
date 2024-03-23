<script lang="ts">
  import "../app.css";
	import { onMount } from "svelte";
 	import { MapManager, type MapState } from "$lib";
	import { page } from "$app/stores";
	import "mapbox-gl/dist/mapbox-gl.css";
	import { invalidate } from "$app/navigation";
	import { MapIcon, MediaQuery, Spreadsheet } from "$components";

	export let data;
	let map: MapManager;
	let container: HTMLDivElement;
	let mapShown = false;
	let highlightDOs: boolean;
	let legendShown: boolean;
	let mapLoaded = false;
	const showMap = () => mapShown = !mapShown;
	const format = (date: number) => new Intl.DateTimeFormat("en-GB", {
		dateStyle: "full",
		timeStyle: "long",
		timeZone: "utc",
	}).format(date);
	const flyTo = (state: MapState) => {
		map && map.flyTo(data.colos, state)
	};

	$: {
		if(map) {
			if(!$page.data.map && highlightDOs) {
				map.render(data.colos, {
					highlightDOs: true,
				});
			} else {
				map.render(data.colos, $page.data.map);
			}
		}
	}
	$: flyTo($page.data.map);

  onMount(() => {
		map = new MapManager(container, () => mapLoaded = true);
		map.render(data.colos, $page.data.map);
		flyTo($page.data.map);
		const interval = setInterval(() => invalidate("map:update"), 6e4);
		return () => clearInterval(interval);
  });
</script>

<div class={`w-screen md:w-[50vw] ${mapShown ? "h-0" : "h-screen px-10 pt-10"} md:h-screen md:px-20 md:pt-20 overflow-auto`}>
	<div class="flex flex-col justify-between h-full">
		<main class="flex flex-col gap-5 w-4/5">
			<slot />
		</main>
		<footer class="text-center text-italic text-sm mt-8 pb-8">
			<p>Page Data Updated At: <span class="whitespace-nowrap">{format($page.data.dataUpdatedAt)}</span></p>
			<p>Status Data Updated At: <span class="whitespace-nowrap">{format($page.data.statusUpdatedAt)}</span></p>
		</footer>
	</div>
</div>

<div class="w-screen md:w-[50vw] h-screen md:h-screen overflow-hidden">
	<MediaQuery query="(min-width: 768px)" let:matches>
		{#if !mapLoaded && (matches || mapShown)}
			<div class="absolute top-0 right-0 w-screen h-screen md:w-[50vw] flex justify-center items-center">
				<svg class="animate-spin -ml-1 mr-3 h-40 w-40 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
					<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
					<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
				</svg>
			</div>
		{/if}
		<div class="w-full h-full" bind:this={container}></div>
		{ matches }
		{#if matches || mapShown}
			<div class={"bg-gray-300 w-fit absolute top-2 right-2" + ($page.data.map ? "" : " p-2") + (legendShown ? "" : " opacity-50")}>
				{#if !$page.data.map}
					<input type="checkbox" id="coding" name="interest" value="coding" bind:checked={highlightDOs}/> Toggle DO Highligt
				{/if}
				<details class="duration-300" bind:open={legendShown}>
					<summary class="cursor-pointer bg-inherit px-5 py-3 text-lg">Legend </summary>
					<div class="bg-white px-5 py-3 text-sm font-light">
						<h2 class="text-lg font-bold">Status</h2>
						<div class="flex items-center gap-2">
							<div class="w-5 h-5 rounded-full bg-status-operational inline-block"></div>
							<p>Operational</p>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<div class="w-5 h-5 rounded-full bg-status-maintenance inline-block"></div>
							<p>Under Maintenance</p>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<div class="w-5 h-5 rounded-full bg-status-outage inline-block"></div>
							<p>Partial Outage</p>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<div class="w-5 h-5 rounded-full bg-status-unknown inline-block"></div>
							<p>Unknown</p>
						</div>
						<h2 class="text-lg font-bold">Miscellaneous</h2>
						<div class="flex items-center gap-2 mt-2">
							<div class="w-5 h-5 rounded-full border-4 border-is-durable inline-block"></div>
							<p>Supports Durable Objects</p>
						</div>
						<div class="flex items-center gap-2 mt-2">
							<div class="w-5 h-5 rounded-full border-4 border-is-worker inline-block"></div>
							<p>Worker-only Datacenter</p>
						</div>
						{#if $page.data.map?.connections}
							<div class="flex items-center gap-2 mt-2">
								<div class="text-4xl leading-3">┅</div>
								<p>Connection </p>
							</div>
						{/if}
					</div>
				</details>
			</div>
		{/if}
	</MediaQuery>
</div>

<button class="absolute bottom-0 right-0 mr-5 mb-5 rounded-full bg-blue-400 w-20 h-20 flex justify-center items-center cursor-pointer md:hidden" on:click={showMap}>
	{#if mapShown}
		<Spreadsheet />
	{:else}
		<MapIcon />
	{/if}
</button>