
<script lang="ts">
  import Login from '$lib/components/Login.svelte';
  import { user } from '$lib/firebase';


</script>

<main class="min-h-screen bg-gray-50 flex flex-col">
  <!-- Reuse your site header -->

  <!-- Centered Login Card -->
  <section class="flex-1 flex items-center justify-center px-6">
    <Login />
  </section>

  <!-- Footer (optional) -->
  <footer class="bg-gray-100 text-center py-6 text-sm text-gray-500">
    &copy; {new Date().getFullYear()} whoRef. Built with Go and Svelte.
  </footer>
</main>
