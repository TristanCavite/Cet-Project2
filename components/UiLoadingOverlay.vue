<template>
  <!-- Fade in/out overlay -->
  <Transition name="fade">
    <div
  v-if="show"
  class="fixed inset-0 z-[100] grid place-items-center bg-transparent"
  role="status"
  aria-live="polite"
  aria-busy="true"
>

      <div class="flex flex-col items-center gap-3">
        <!-- Spinning logo or bounce-->
        <img
          :src="logo"
          alt="Loading"
          class="h-20 w-20 select-none animate-spin-slow"  
          draggable="false"
        />
        <p class="text-maroon font-semibold">{{ label }}</p>

        <!-- Reduced-motion fallback -->
        <span class="sr-only">Loading…</span>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    show: boolean
    label?: string
    /** Path to your logo inside /public (e.g., '/logo.jpg' or '/logo.svg') */
    logo?: string
  }>(),
  {
    label: 'Loading…',
    logo: '/logoTab.png', // ← change if your file is different
  }
)
</script>

<style scoped>
/* Smooth fade for the overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tailwind has keyframes: spin; this just slows it down a bit. */
@media (prefers-reduced-motion: no-preference) {
  .animate-spin-slow {
    animation: spin 2.2s linear infinite;
  }
}
</style>
