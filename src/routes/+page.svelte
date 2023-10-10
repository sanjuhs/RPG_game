<script>
	import heroimg from '$lib/images/herosection/hs2.png';
	import logoimg from '$lib/images/logo/logo1.png';
	import LandingNavBar from '$lib/components/landing/landingNavBar.svelte';
	import Landingfooter from '$lib/components/landing/landingfooter.svelte';
	// import heromobimg from '$lib/images/hero_mob.png';
</script>

<!--Landing page-->
<head>
	<link
		href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600&display=swap"
		rel="stylesheet"
	/>
</head>

<!-- <body style="background-image: url({heroimg});"> -->
<body>
	<LandingNavBar />
	<div class="content">
		<a href="/login">
			<img src={heroimg} alt="the_hero_img" class="hero" />
		</a>
		<p class="statement">
			<a href="/login" class="spl"> Just another RPG</a> - craft the world as you
			<a href="/login"> play </a>
			and help <a href="/login">build</a> a better version of the
			<a href="/login">existing world</a>
		</p>
		<p class="para">(An AI powered RPG... !)</p>
	</div>
</body>
<Landingfooter />

<style>
	body {
		height: 100%;
		margin: 0; /* Remove default margin */
		overflow-y: scroll; /* ensures scrollbar always present */
		font-family: 'Poppins', Arial, sans-serif;
		color: #363435;
		background-color: #f6f6f6;
	}

	/* --- Hero Section -- */

	.content {
		margin-top: -15px;
		text-align: center;
		margin-left: auto;
		margin-right: auto;
		max-width: 80vw;
	}

	.hero {
		/* width: 40vw; */
		height: 70vh;
		display: block;
		margin-left: auto;
		margin-right: auto;
	}

	.statement {
		margin-top: 0;
		font-size: 1.6em;
		font-weight: 100;
		margin-bottom: 0;
		/* max-width: 80vh; */
	}
	.para {
		margin-top: 0;
		font-size: 0.4em;
		margin-bottom: 4%;
	}

	.statement a {
		text-decoration: none; /* Removing underlines from links */
		color: black; /* Setting link color, change as needed */
		padding: 7px 14px; /* Some padding for a nicer touch effect */
		transition: background-color 0.3s ease; /* Smooth color transition */
		border-radius: 10px;
	}

	.statement a:hover {
		background-color: #9ceb57; /* Color change on hover, adjust as needed */
	}
	.spl {
		background-color: #f6d779;
	}
</style>
