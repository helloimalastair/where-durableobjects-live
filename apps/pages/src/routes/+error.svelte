<script lang="ts">
import { page } from "$app/stores";
import { Anchor, Head, BackButton } from "$components";
</script>

{#if $page.status === 404}
<Head title="Not Found" />
<header>
	<h1 class="font-bold text-5xl">Starlink (STLNK)</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	<BackButton />
</header>
<p class="text-xl">You found the mythical Starlink Colo!</p>
<p class="text-xl mt-5">Just kidding. Unfortunately, the page you requested was not found. Check your URL, check back later, and if all else fails, come visit us in <Anchor class="text-sky-500 hover:text-sky-300" target="https://discord.gg/cloudflaredev">the Discord</Anchor>!</p>
{:else if $page.status === 400}
<Head title="Malformed Request" />
<header>
	<h1 class="font-bold text-5xl">Lumpy Cookies (YUM)</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	<BackButton />
</header>
<p class="text-xl">We love our lumpy, misshapen cookies here at <span class="italic">WDOL</span>. Unfortunately, the URL you provided doesn't match the format we require. Check your URL, and try again!</p>
{:else if $page.status === 500}
<Head title="Internal Server Error" />
<header>
	<h1 class="font-bold text-5xl">Oops (BLEP)</h1>
	<Anchor target="/" internal={true} class="italic text-2xl mb-5">Where Durable Objects Live</Anchor>
	<BackButton />
</header>
<p class="text-xl">Our Data Doggos have been acting up! Unfortunately we have experienced an internal error, so we aren't able to display the page you requested. The page should be back within a minute or two.</p>
<p class="text-xl">If the problem persists, please raise an issue in our Discord!</p>
{/if}