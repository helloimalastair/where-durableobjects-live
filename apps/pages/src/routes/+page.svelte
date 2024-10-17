<script lang="ts">
import { Anchor, Head } from "$components";
import type { PageData } from "./$types";

export let data: PageData;
</script>
<Head />
<header>
	<h1 class="font-bold text-5xl mb-3">Where Durable Objects Live</h1>
</header>
<p>
	Created by the wonderful <Anchor target="https://jed.is/">Jed Schmidt</Anchor>, and now maintained with ❤️ by <Anchor target="https://goalastair.com">Alastair</Anchor>. Source code available on <Anchor target="https://github.com/helloimalastair/where-durableobjects-live">Github</Anchor>.
</p>
<p>
	<Anchor target="https://developers.cloudflare.com/workers/learning/using-durable-objects">Cloudflare Durable Objects</Anchor> are a novel approach to stateful compute based on <Anchor target="https://workers.cloudflare.com/">Cloudflare Workers</Anchor>. They aim to locate both compute <span class="italic">and</span> state closest to end users.
</p>
<p>
	This page tracks where new Durable Objects are created; for example, when you loaded this page{#if data.city}{" from "}<span class="font-bold">{data.city}</span>{/if}, a worker in  <span class="font-bold">{data.worker}</span> created a durable object in  <span class="font-bold">{data.durable}</span>.
</p>
<p>
	Currently, Durable Objects are available in <span class="font-bold">{data.coverage}</span>% of Cloudflare PoPs.
</p>
<p>
	To keep data fresh, this application is constantly creating/destroying new Durable Objects around the world. In the last hour, <span class="font-bold">{data.hourly.toLocaleString("en-US")}</span> Durable Objects have been created(and subsequently destroyed), <span class="italic font-bold">FOR SCIENCE!</span>
</p>
<p>
	Data displayed on this site is updated every 5 minutes. Historical data may be available via the API in the future. Discussion of coming features is on the <Anchor class="text-sky-500 hover:text-sky-300" target="/discord">Discord Server</Anchor>.
</p>
<p>
	Details about the API can be found <Anchor target="/api" internal={true}>here</Anchor>.
</p>
<h2 class="font-bold text-2xl">See data by:</h2>
<ul class="list-disc list-inside text-lg italic">
	<li><a class="underline" href="/colo">Colo</a></li>
	<li><a class="underline" href="/jurisdiction">Jurisdiction</a></li>
	<li><a class="underline" href="/region">Region</a></li>
</ul>