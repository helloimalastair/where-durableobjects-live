<script lang="ts">
	import { page } from "$app/stores";
	export let title = "Where Durable Objects Live";
	const customTitle = title !== "Where Durable Objects Live";
	const cleanUrl = $page.url.origin + $page.url.pathname;
	const image = $page.url.origin + "/globe.png";
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<title>{ (customTitle ? `${title} | ` : "") + "Where Durable Objects Live" }</title>
	<meta name="theme-color" content="#F38020" />
	<meta name="title" content={ title } />
	<meta name="description" content="Tracking where Durable Objects are created, wherever you are in the world." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={ cleanUrl } />
	<meta property="og:title" content={ title } />
	{#if customTitle}
		<meta property="og:site_name" content="Where Durable Objects Live" />
	{/if}
	<meta property="og:description" content="Tracking where Durable Objects are created, wherever you are in the world." />
	<meta property="og:image" content={image} />
	<meta property="twitter:card" content="summary" />
	<meta property="twitter:url" content={ cleanUrl } />
	<meta property="twitter:title" content={ title } />
	<meta property="twitter:description" content="Tracking where Durable Objects are created, wherever you are in the world." />
	<meta property="twitter:image" content={ image } />
</svelte:head>