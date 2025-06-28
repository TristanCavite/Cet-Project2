<template>
  <NavbarMobile v-if="isMobile" />
  <NavbarMain v-else/>
  <div class="pt-[106px]"> <!-- Adjusted for the height of the navbar -->
    <slot />
  </div>
  <FooterMain/>
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
