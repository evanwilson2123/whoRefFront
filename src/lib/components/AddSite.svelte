<script lang="ts">
  import { getIdToken } from "$lib/firebase";
  import { writable } from "svelte/store";
  import { goto } from "$app/navigation";

  let name = "";
  let url = "";
  const error = writable<string | null>(null);
  let apiKey = "";
  let showModal = false;

  async function handleAddSite(event: Event) {
    event.preventDefault();
    error.set(null);
    apiKey = "";
    showModal = false;

    try {
      // 1) Get a fresh Firebase ID token
      const fbUserToken = await getIdToken();
      if (!fbUserToken) {
        throw new Error("Unable to retrieve ID token");
      }

      // 2) Send POST /site with JSON body { name, url }
      const response = await fetch(`${import.meta.env.VITE_BASE_API}/site`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fbUserToken}`,
        },
        body: JSON.stringify({ name, url }),
      });

      if (response.status === 409) {
        // Conflict: site name already exists
        error.set("You already have a site with that name.");
        return;
      }

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to add site");
      }

      // 3) On success, extract the returned API key and show modal
      const data = await response.json();
      apiKey = data.key; // “key” is the UUID from your Go handler
      showModal = true;

      // Clear form inputs
      name = "";
      url = "";
    } catch (e: any) {
      error.set(e.message);
    }
  }

  function handleConfirm() {
    showModal = false;
    goto("/dashboard");
  }

  // 4) Build the exact <script> snippet, but break up "<script>" so Svelte doesn't parse it
  $: snippet = apiKey
    ? "<" + `script src="https://whorefback.onrender.com/tracker.js?site-key=${apiKey}" defer></` + "script>"
    : "";
</script>

<section class="min-h-screen bg-gray-50 flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
  <form
    on:submit={handleAddSite}
    class="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8 space-y-6"
  >
    <h2 class="text-3xl font-extrabold text-gray-900 text-center">Add New Site</h2>

    {#if $error}
      <p class="text-red-600 text-sm text-center">{$error}</p>
    {/if}

    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
      <input
        id="name"
        type="text"
        bind:value={name}
        required
        placeholder="My Blog"
        class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div>
      <label for="url" class="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
      <input
        id="url"
        type="url"
        bind:value={url}
        required
        placeholder="https://example.com"
        class="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <button
      type="submit"
      class="w-full py-3 bg-indigo-600 text-white font-semibold rounded-2xl shadow-sm hover:bg-indigo-700 transition"
    >
      + Add Site
    </button>
  </form>

  {#if showModal}
    <!-- Modal Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full mx-4 p-6 space-y-4">
        <h3 class="text-2xl font-bold text-gray-900">Site Added!</h3>
        <p class="text-gray-700">
          Copy and paste the following script tag into your site’s HTML:
        </p>
        <pre class="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap break-words">
{snippet}
        </pre>
        <p class="text-gray-700">
          Copy it and, if you need further instructions, visit
          <a href="/instructions" class="text-indigo-600 hover:underline">Instructions</a>.
        </p>
        <button
          on:click={handleConfirm}
          class="mt-4 w-full py-2 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition"
        >
          Got It
        </button>
      </div>
    </div>
  {/if}
</section>

<style>
  /* All styling via Tailwind classes */
</style>
