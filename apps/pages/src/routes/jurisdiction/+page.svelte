<script lang="ts">
import { Anchor, Congress, EU, Head, BackButton } from "$components";
</script>
<Head title="Jurisdictions" />
<header>
	<h1 class="font-bold text-5xl">Jurisdictions</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	<BackButton />
</header>
<p class="text-xl">Jurisdictions are a way to spawn a Durable Object in a specific legal jurisdiction. This can be useful for ensuring that your data is stored in accordance with legal requirements.</p>
<div class="flex flex-wrap">
	<Anchor class="px-3 m-1 rounded-3xl text-xl text-white bg-blue-600 whitespace-nowrap" target="/jurisdiction/eu" internal={true}>
		<EU />
		European Union
	</Anchor>
	<Anchor class="px-3 m-1 rounded-3xl text-xl text-white bg-red-600 whitespace-nowrap" target="/jurisdiction/fedramp" internal={true}>
		<Congress />
		FedRAMP
	</Anchor>
</div>