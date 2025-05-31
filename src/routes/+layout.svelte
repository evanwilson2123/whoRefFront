<script lang="ts">
  import '../app.css';
</script>

<main class="min-h-screen bg-gray-50 flex flex-col">
  <!-- always-on header -->
  <header class="w-full py-6 px-6 md:px-12 flex justify-between items-center shadow bg-white">
    <h1 class="text-2xl font-bold text-black">whoRef</h1>
    <nav class="hidden md:flex space-x-6 text-sm font-medium">
      <a href="/" class="hover:text-indigo-600">Home</a>
      <a href="#features" class="hover:text-indigo-600">Features</a>
      <a href="#how" class="hover:text-indigo-600">How it works</a>
      <a href="#faq" class="hover:text-indigo-600">FAQ</a>
    </nav>
  </header>

  <!-- page content -->
  <slot />

  <!-- always-on footer -->
  <footer class="mt-auto bg-gray-100 text-center py-6 text-sm text-gray-500">
    &copy; {new Date().getFullYear()} whoRef. Built with Go and Svelte.
  </footer>
</main>
