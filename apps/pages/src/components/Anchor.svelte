<script lang="ts">
	let classes = "text-sky-500 hover:text-sky-300";
	let target: string;
	let internal = false;
	export { classes as class, target, internal };
</script>

{#if internal}
<a class={classes} href={target}>
	<slot />
</a>
{:else}
<a class={classes} href={target} target="_blank" rel="noopener noreferrer">
	<slot />
</a>
{/if}