<script lang="ts">
import { Anchor, Head, BackButton } from "$components";
</script>
<Head title="API" />
<header>
	<h1 class="font-bold text-5xl">API</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	<BackButton />
</header>
<p class="text-xl">
	There are now three endpoints:
</p>
<ul class="list-disc list-inside text-lg">
	<li><Anchor target="/json" class="underline text-sky-500 hover:text-sky-300">/json</Anchor>: the original</li>
	<li><Anchor target="/v2/json" class="underline text-sky-500 hover:text-sky-300">/v2/json</Anchor>: with latency data</li>
	<li><Anchor target="/api/v3/data.json" class="underline text-sky-500 hover:text-sky-300">/api/v3/data.json</Anchor>(<Anchor target="/api/v3/schema.json" class="underline text-sky-500 hover:text-sky-300">Schema</Anchor>): and nearest region</li>
</ul>
<p>We are currently evaluating usage of the older API routes, and whether they can be removed, to reduce complexity. While no action is <i class="italic">required</i> at this time, we would strongly recommend moving to the v3 API, which also now includes a <Anchor target="/api/v3/schema.json" class="underline text-sky-500 hover:text-sky-300">JSON Schema</Anchor> for ease-of-use.</p>

<p>If a decision is made to remove the old API routes, ample warning will be given before any hard action will be taken, and updates will be posted both on this page and in the <Anchor class="text-sky-500 hover:text-sky-300" target="/discord">Discord server</Anchor>.</p>