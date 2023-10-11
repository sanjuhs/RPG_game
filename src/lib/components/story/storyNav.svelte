<script>
	import logoimg from '$lib/images/logo/logo1.png';
</script>

<header class="sticky">
	<div class="">
		<nav class="navbar">
			<div class="navbar-logoHead">
				<a href="/" class=""><img src={logoimg} class="logopic" alt="logo" /> </a>
				<a href="/" class="remove-all-a">&nbsp Another RPG</a>
			</div>
			<ul class="navbar-menu">
				<li><a href="/app/storychat" id="btndemo">Story </a></li>
				<li><a href="/app/info" id="btndemo">Info </a></li>
				<li><a href="/app/herostats">Herostats</a></li>
				<li><a href="/app/gear">Gear </a></li>
				<li><a href="/app/inventory" id="btndemo">Inventory </a></li>
			</ul>
		</nav>
	</div>
</header>

<style>
	/* body {
		height: 100%;
		margin: 0; 
		overflow-y: scroll; 
		font-family: 'Poppins', Arial, sans-serif;
		color: #363435;
		background-color: #f6f6f6;
	} */

	.remove-all-a {
		text-decoration: none; /* Removes underline */
		font-weight: normal; /* Ensures text is not bold */
		font-style: normal; /* Ensures text is not italic */
		color: inherit; /* Inherits the color of the parent element */
	}

	/* --- top navigation bar -- */
	.sticky {
		position: sticky;
		top: 0;
		z-index: 10; /* Make sure the header is always on top */
		background-color: rgba(255, 255, 255, 0); /* You can choose another color if you prefer */
	}
	.navbar {
		display: flex; /* Using flexbox to layout items horizontally */
		justify-content: space-between; /* Pushing logo and menu to opposite ends */
		align-items: center; /* Centering items vertically */
		padding: 15px 30px; /* Some padding for breathing space */
	}
	.navbar-logoHead {
		display: flex;
		align-items: center;
	}

	.logopic {
		width: 50px; /* Adjust this value according to your needs */
		height: 50px; /* Adjust this value according to your needs */
	}

	.navbar-menu {
		list-style-type: none; /* Removing bullet points */
		display: flex; /* Laying out menu items horizontally */
		gap: 20px; /* Space between menu items */
	}

	.navbar-menu li a {
		text-decoration: none; /* Removing underlines from links */
		color: black; /* Setting link color, change as needed */
		padding: 7px 14px; /* Some padding for a nicer touch effect */
		transition: background-color 0.3s ease; /* Smooth color transition */
		border-radius: 10px;
	}

	.navbar-menu li a:hover {
		background-color: #eee; /* Color change on hover, adjust as needed */
	}
</style>
