
<script lang="ts">
</script>

<section class="min-h-screen bg-gray-50 text-gray-800">
  <!-- Top bar -->
  <header class="flex justify-between items-center px-6 py-4 bg-white shadow">
    <p class="text-sm text-gray-600">Signed in as <span class="font-medium"></span></p>
  </header>

  <!-- Main content area -->
  <main class="px-6 py-10 max-w-6xl mx-auto">
    <h2 class="text-3xl font-bold mb-6">Your Sites</h2>

    <!-- Site list (placeholder UI) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div class="p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition">
        <h3 class="text-xl font-semibold mb-1">example.com</h3>
        <p class="text-gray-500 text-sm mb-2">Referrers: 42</p>
        <a href="/dashboard/example" class="text-indigo-600 hover:underline text-sm">View Analytics →</a>
      </div>
      <!-- Add more site cards here dynamically -->
    </div>

    <!-- Create site CTA -->
    <div class="mt-12 text-center">
      <button class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
        + Add New Site
      </button>
    </div>
  </main>
</section>
