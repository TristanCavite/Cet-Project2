<template>
    <div>
        this is the degree program page for head admin
    </div>
</template>

<script setup> 

// Apply middleware for authentication and role protection
definePageMeta({
  middleware: 'auth', // Protect this page
  layout: "head-admin", // Optional: use specific layout
});
</script>
  