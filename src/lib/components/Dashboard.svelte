
<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { user, getIdToken } from "$lib/firebase";
  import { goto } from "$app/navigation";

  // holds the sites returned from /dash
  let sites: { id: string; url: string }[] = [];
  const error = writable<string | null>(null);
  let loading = true;

  // 1) When component mounts, wait for Firebase user, then fetch /dash
  onMount(() => {
    const unsubscribe = user.subscribe(async (fbUser) => {
      if (!fbUser) return; // still waiting for Firebase to restore user

      try {
        const token = await getIdToken();
        const res = await fetch("http://localhost:8080/dash", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to fetch dashboard data");
        }
        const data = await res.json();
        sites = data.sites;
      } catch (e: any) {
        error.set(e.message);
      } finally {
        loading = false;
      }
      unsubscribe();
    });
  });

  // Navigate to the “Add Site” page
  function goToAddSite() {
    goto("/site");
  }
</script>

<section class="min-h-screen bg-gray-50 flex flex-col items-center py-12 space-y-8">
  <div class="w-full max-w-6xl px-6">
    <h2 class="text-3xl font-bold mb-4">Your Sites</h2>

    {#if loading}
      <div class="flex items-center justify-center h-32">
        <p class="text-gray-600">Loading your sites…</p>
      </div>
    {:else}
      {#if $error}
        <p class="text-red-600 text-center mt-4">{$error}</p>
      {/if}

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {#each sites as site}
          <div class="p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-md transition">
            <h3 class="text-xl font-semibold mb-1">{site.url}</h3>
            <a href={`/dashboard/${site.id}`} class="text-indigo-600 hover:underline text-sm">
              View Analytics →
            </a>
          </div>
        {:else}
          <p class="text-gray-500">No sites found.</p>
        {/each}
      </div>
    {/if}
  </div>

  <button
    on:click={goToAddSite}
    class="mt-8 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-2xl shadow-sm hover:bg-indigo-700 transition"
  >
    + Add New Site
  </button>
</section>

<style>
  /* Tailwind classes handle styling */
</style>
