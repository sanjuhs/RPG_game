<script>
	import LandingNavBar from '$lib/components/landing/landingNavBar.svelte';
	import Landingfooter from '$lib/components/landing/landingfooter.svelte';
</script>

<body>
	<LandingNavBar />
	<slot />
	<Landingfooter />
</body>

<style>
	body {
		height: 100%;
		margin: 0; /* Remove default margin */
		overflow-y: scroll; /* ensures scrollbar always present */
		font-family: 'Poppins', Arial, sans-serif;
		color: #363435;
		background-color: #f6f6f6;
	}
</style>
