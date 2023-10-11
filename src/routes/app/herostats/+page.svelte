<script>
	import { appStore, hsStore } from '$lib/components/stores.js';
	import { onMount } from 'svelte';
	import StoryNav from '$lib/components/story/storyNav.svelte';
	import { marked } from 'marked';

	console.log($hsStore);
	let ge;
	onMount(async () => {
		ge = JSON.stringify($hsStore);
		console.log(ge);
		console.log('the hs stoer is ', $hsStore);
		console.log('the current stats are ', ge);
	});
</script>

<StoryNav />
<h1>Your current game stats</h1>
<p>
	the value of your stats are :
	{$hsStore}
</p>
<div class="gg">
	<pre>
        {$hsStore}
    </pre>
</div>

<style>
	.gg {
		font-family: sans-serif;
		font-size: small;
		background-color: blue;
	}
</style>
