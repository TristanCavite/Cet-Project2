<template>
  <main class="flex-1 p-10">
    <header class="mt-20">
      <h1 class="text-3xl font-semibold text-red-800">WELCOME SA FACULTY NA PAGE!!</h1>
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
  

  