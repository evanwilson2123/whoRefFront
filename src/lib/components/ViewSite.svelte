<script lang="ts">
  import { page } from "$app/stores";
  import { user, getIdToken } from "$lib/firebase";
  import { writable } from "svelte/store";

  // 1) Pull the "siteId" param out of the URL
  let siteId: string;
  $: siteId = $page.params.siteId;

  // 2) Base URL for your backend (e.g. Render). Set this in .env
  const apiBase = import.meta.env.VITE_BASE_API;

  // 3) This is where we'll store the fetched site data (if/when it arrives)
  let siteData: {
    id: string;
    name: string;
    url: string;
    referrers: { timestamp: string; site: string }[];
  } | null = null;

  // 4) Loading and error states
  const loading = writable(true);
  const error = writable<string | null>(null);

  // 5) A helper function that actually performs the fetch once we know "user" is non-null
  async function fetchSiteData() {
    loading.set(true);
    error.set(null);

    try {
      // Get a fresh Firebase ID token for auth
      const token = await getIdToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      // Call your backend GET /get-site/{siteId}
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
  }

  // 6) Reactive statement: as soon as "$user" is non-null, fire fetchSiteData().
  //    If $user changes from null → FirebaseUser, or if you navigate and $user is already set,
  //    this block runs exactly once (because we call fetchSiteData() only if siteData is still null).
  $: if ($user && siteData === null) {
    fetchSiteData();
  }
</script>

<section class="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
  <div class="w-full max-w-4xl">
    {#if $loading}
      <!-- Always show "Loading..." until fetchSiteData() completes or errors -->
      <div class="flex items-center justify-center h-32">
        <p class="text-gray-600">Loading site analytics…</p>
      </div>
    {:else}
      {#if $error}
        <p class="text-red-600 text-center mt-4">{$error}</p>
      {:else if siteData}
        <div class="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900 mb-2">
            Analytics for <span class="text-indigo-600">{siteData.url}</span>
          </h2>
          <p class="text-gray-600 mb-6">Site Name: {siteData.name}</p>

          <h3 class="text-xl font-semibold mb-4 text-gray-800">Referrers</h3>

          {#if siteData.referrers.length > 0}
            <ul class="divide-y divide-gray-200">
              {#each siteData.referrers as r}
                <li class="py-4">
                  <p class="text-sm text-gray-500">⏱ {r.timestamp}</p>
                  <p class="text-gray-800">
                    <strong>Site Key:</strong> {r.site}
                    <br />
                    <strong>URL:</strong> {r.url}
                    <br />
                    <strong>Path:</strong> {r.path}
                  </p>
                </li>
              {/each}
            </ul>
          {:else}
            <p class="text-gray-500">No referrers yet.</p>
          {/if}
        </div>
      {/if}
    {/if}
  </div>
</section>

<style>
  /* Tailwind handles styling; no additional CSS needed */
</style>
