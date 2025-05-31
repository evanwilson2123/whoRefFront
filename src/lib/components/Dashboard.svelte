
<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { user, getIdToken } from "$lib/firebase";

  // holds the sites returned from /dash
  let sites: { id: string; url: string }[] = [];
  const error = writable<string | null>(null);
  let loading = true;

  onMount(() => {
    // Subscribe to the Firebase "user" store
    const unsubscribe = user.subscribe(async (fbUser) => {
      if (!fbUser) {
        // If fbUser is still null, we just keep showing "loading"
        return;
      }

      // Now that we have a non-null user, get the token and fetch
      try {
        const token = await getIdToken();    // guaranteed to succeed if fbUser is non-null
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
        sites = data.sites; // populate
      } catch (e: any) {
        error.set(e.message);
      } finally {
        loading = false;
      }

      // Once we've fetched (or errored), we can unsubscribe; no need to react on further changes
      unsubscribe();
    });
  });
</script>

{#if loading}
  <div class="flex items-center justify-center h-full">
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

<style>
  /* Tailwind is doing most of the heavy lifting; no extra CSS needed */
</style>
