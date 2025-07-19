<template>
  <NavbarMobile v-if="isMobile" />
  <NavbarMain v-else/>
  <main class="pt-[135px]"> <!-- Adjusted for the height of the navbar -->
    <slot />
  </main>
  <FooterMobile v-if="isMobile"/>
  <FooterMain v-else/>
</template>

<script setup lang="ts">
    import { ref, onMounted, onBeforeUnmount } from 'vue'

    const isMobile = ref(window.innerWidth < 640)

    const handleResize = () => {
    isMobile.value = window.innerWidth < 640
    }

    onMounted(() => {
    window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    })
</script>
