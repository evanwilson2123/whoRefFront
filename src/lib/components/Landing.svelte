
<script lang="ts">
	// You could later bind this to a modal or sign-up form
	function handleGetStarted() {
		window.location.href = "/sign-in"; // change as needed
	}

    function handleTutorial() {
        window.location.href = "/tutorial";
    }
</script>

<main class="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
	<!-- Header -->

	<!-- Hero Section -->
	<section class="flex flex-col items-center text-center px-6 py-24 bg-white">
		<h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 max-w-2xl">
			Track where your traffic comes from — without Google
		</h2>
		<p class="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
			Simple, privacy-first website analytics powered by your own Go backend. No cookies. No bloat. Just insights.
		</p>
		<button
			on:click={handleGetStarted}
			class="outline-3 text-black px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-200 hover:cursor-pointer transition"
		>
			Get Started
		</button>
	</section>

	<!-- Features -->
	<section id="features" class="bg-gray-100 py-20 px-6 md:px-12">
		<h3 class="text-3xl font-bold text-center mb-12">Why whoRef?</h3>
		<div class="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
			<div>
				<h4 class="text-xl font-semibold mb-2">Plug & Track</h4>
				<p>Drop a single script tag on any site and start tracking traffic instantly.</p>
			</div>
			<div>
				<h4 class="text-xl font-semibold mb-2">Privacy First</h4>
				<p>No cookies. No user profiling. Compliant by default.</p>
			</div>
			<div>
				<h4 class="text-xl font-semibold mb-2">Your Data</h4>
				<p>Self-hosted Go backend means your traffic data stays yours.</p>
			</div>
		</div>
	</section>

	<!-- How it works -->
	<section id="how" class="py-20 px-6 md:px-12 bg-white">
		<h3 class="text-3xl font-bold text-center mb-12">How it works</h3>
		<div class="max-w-4xl mx-auto space-y-6 text-gray-700">
			<p>1. Copy a single script tag into your website.</p>
			<p>2. Visitors are tracked with no cookies or identifiers.</p>
			<p>3. View detailed referrer and pageview stats in your dashboard.</p>
		</div>
        <div class="flex items-center justify-center">
            <button on:click={handleTutorial} class="mt-8 outline-3 text-black rounded-lg px-6 py-3 hover:bg-gray-200 hover:cursor-pointer transition">Tutorial</button>
        </div>
	</section>

	<!-- Footer -->
	<footer class="mt-auto bg-gray-100 text-center py-6 text-sm text-gray-500">
		&copy; {new Date().getFullYear()} whoRef. Built with Go and Svelte.
	</footer>
</main>
