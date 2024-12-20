<template>
    <!-- Main Content -->
    <main class="flex-1 p-10">
      <header class="mb-6">
        <h1 class="text-3xl font-semibold text-red-800">Admin Dashboard</h1>
      </header>
      <section>
        <p>Welcome to the Admin Dashboard. Select a section to manage.</p>
      </section>
    </main>
  </template>
  
  <script setup>

// Apply middleware for authentication and role protection
definePageMeta({
  middleware: 'auth', // Protect this page
  layout: "super-admin", // Optional: use specific layout
});
</script>

  