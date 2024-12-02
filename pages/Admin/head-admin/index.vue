<template>
    <main class="flex-1 p-8 ml-64">
      <header class="mb-6">
        <h1 class="text-3xl font-semibold text-red-800">ELCOME PASOK KANA SA HEAD ADMIN!!</h1>
      </header>
    </main>
</template>
  
<script setup>
// Apply middleware for authentication and role protection
definePageMeta({
  middleware: 'auth', // Protect this page
  layout: "head-admin", // Optional: use specific layout
});
</script>
  
  