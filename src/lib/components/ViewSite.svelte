
<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { getIdToken } from "$lib/firebase";
  import { writable } from "svelte/store";

  // 1) Read the siteId from the route params
  let siteId: string;
  $: siteId = $page.params.siteId;

  // 2) You can override this if needed
  export let apiBase = "http://localhost:8080";

  // 3) siteData matches the JSON shape from your Go handler
  let siteData: {
    id: string;
    name: string;
    url: string;
    referrers: {
      path: string;
      url: string;
      timestamp: string;
      site: string;
    }[];
  } | null = null;

  const loading = writable(true);
  const error = writable<string | null>(null);

  onMount(async () => {
    loading.set(true);
    error.set(null);

    try {
      const token = await getIdToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const res = await fetch(`${apiBase}/get-site/${siteId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to load site data");
      }

      const data = await res.json();
      console.log(JSON.stringify(data))
      siteData = {
        id: data.id,
        name: data.name,
        url: data.url,
        referrers: data.referrers,
      };
    } catch (e: any) {
      console.error(e);
      error.set(e.message);
    } finally {
      loading.set(false);
    }
  });
</script>

{#if $loading}
  <div class="flex items-center justify-center h-32">
    <p class="text-gray-600">Loading site analytics…</p>
  </div>
{:else}
  {#if $error}
    <p class="text-red-600 text-center mt-4">{$error}</p>
  {:else if siteData}
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4">Analytics for {siteData.url}</h2>
      <p class="mb-4 text-gray-700">Site Name: {siteData.name}</p>

      <h3 class="text-xl font-semibold mb-2">Referrers</h3>
      {#if siteData.referrers.length > 0}
        <ul class="divide-y divide-gray-200">
          {#each siteData.referrers as r}
            <li class="py-2 flex flex-col">
              <span class="text-sm text-gray-500">Timestamp: {r.timestamp}</span>
              <span class="text-gray-800">Path: {r.path}</span>
              <span class="text-gray-800">From: {r.url}</span>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-gray-500">No referrers yet.</p>
      {/if}
    </div>
  {/if}
{/if}

<style>
  /* All styling via Tailwind classes */
</style>
