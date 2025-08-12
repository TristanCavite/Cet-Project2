<template>
  <div class="min-h-dvh grid place-items-center text-gray-600">
    Redirecting…
  </div>
</template>

<script setup>
// Minimal relay: forward Firebase action links to our styled page.
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  // Preserve all query params (mode, oobCode, lang, continueUrl, etc.)
  router.replace({ path: '/auth/reset-password', query: route.query })
})
</script>
