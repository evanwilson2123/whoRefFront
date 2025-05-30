
<script lang="ts">
  import { user, login, signup, logout } from '$lib/firebase';
  import { writable } from 'svelte/store';
  import type { FirebaseError } from 'firebase/app';
  import { goto } from '$app/navigation';

  // toggle state
  let mode: 'login' | 'signup' = 'login';

  // form fields & error
  let email = '';
  let password = '';
  const error = writable<string | null>(null);

  async function handleLogin() {
    try {
      await login(email, password);
      error.set(null);
      goto('/dashboard');
    } catch (e) {
      error.set((e as FirebaseError).message);
    }
  }

  async function handleSignup() {
    try {
      await signup(email, password);
      error.set(null);
      goto('/dashboard');
    } catch (e) {
      error.set((e as FirebaseError).message);
    }
  }

  function handleLogout() {
    logout();
    goto('/');
  }
</script>

<section class="flex flex-col items-center text-center px-6 py-24 bg-white min-h-screen w-full">
  {#if $user}
    <!-- Already signed in -->
    <p class="text-gray-800 mb-6">✅ Signed in as {$user.email}</p>
    <button
      on:click={handleLogout}
      class="outline-3 text-black px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-200 transition"
    >
      Sign Out
    </button>
  {:else}
    <!-- Mode switch -->
    <div class="mb-8">
      <button
        on:click={() => (mode = 'login')}
        class="px-4 py-2 font-semibold rounded-t-lg"
        class:underline={mode === 'login'}
      >
        Log In
      </button>
      <button
        on:click={() => (mode = 'signup')}
        class="px-4 py-2 font-semibold rounded-t-lg"
        class:underline={mode === 'signup'}
      >
        Sign Up
      </button>
    </div>

    <!-- Heading & subtext -->
    <h2 class="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900 max-w-2xl">
      {mode === 'login' ? 'Welcome back!' : 'Create your account'}
    </h2>
    <p class="text-lg md:text-xl text-gray-600 max-w-xl mb-8">
      {mode === 'login'
        ? 'Enter your credentials to access your dashboard.'
        : 'Sign up below and start tracking your traffic.'}
    </p>

    <!-- Form -->
    <form
      on:submit|preventDefault={mode === 'login' ? handleLogin : handleSignup}
      class="w-full max-w-md space-y-4"
    >
      <input
        type="email"
        bind:value={email}
        placeholder="you@example.com"
        required
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="password"
        bind:value={password}
        placeholder="Password"
        required
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      {#if $error}
        <p class="text-red-600 text-sm">{$error}</p>
      {/if}

      <button
        type="submit"
        class="outline-3 text-black px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-200 transition"
      >
        {mode === 'login' ? 'Log In' : 'Sign Up'}
      </button>
    </form>
  {/if}
</section>
