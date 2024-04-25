<script lang="ts">
	import { browser } from "$app/environment";
</script>
{#if browser && window.history.state["sveltekit:history"]}
	<div>
		<button class="text-xl font-bold" on:click={() => window.history.back()}>← Back</button>
	</div>
{/if}