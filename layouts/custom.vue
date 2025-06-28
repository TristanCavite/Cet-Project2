<template>
    <NavbarMobile v-if="isMobile" />
    <NavbarMain v-else/>
    <main class="mt-14"> <!-- Adjusted for the height of the navbar -->
        <slot />
    </main>
    <FooterMobile v-if="isMobile"/>
    <FooterSecondaryFooter v-else/>
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
