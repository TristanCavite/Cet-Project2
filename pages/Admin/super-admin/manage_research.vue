<template>
    <div>
        this is the manage research page for super admin
    </div>
</template>

<script lang="ts" setup>
    definePageMeta({
        middleware: "auth",
        layout: "super-admin"
        
    });
</script>