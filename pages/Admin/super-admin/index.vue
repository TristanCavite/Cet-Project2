<template>
    <!-- Main Content -->
    <main class="p-10">
        <div class="mt-20">
            this is the home page for super admin
        </div>
    </main>
  </template>
  
  <script setup>

// Apply middleware for authentication and role protection
definePageMeta({
  middleware: 'auth', // Protect this page
  layout: "super-admin", // Optional: use specific layout
});
</script>

  