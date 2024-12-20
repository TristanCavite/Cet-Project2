<template>
    <main class="p-10">
        <div class="mt-20">
            this is the degree program page for head admin
        </div>
    </main>
</template>

<script setup> 

// Apply middleware for authentication and role protection
definePageMeta({
  middleware: 'auth', // Protect this page
  layout: "head-admin", // Optional: use specific layout
});
</script>
  