<template>
  <div class="flex min-h-screen flex-col">
    <!-- Keep nav in ClientOnly to avoid SSR width mismatch -->
    <ClientOnly>
      <NavbarMobile v-if="isMobile" />
      <NavbarMain v-else />
      <template #fallback>
        <!-- Simple skeleton while hydrating -->
        <div class="h-[135px] w-full bg-neutral-100"></div>
      </template>
    </ClientOnly>

    <!-- Page body -->
    <main class="flex-1 pt-[135px]">
      <!-- ✅ STEP 1: Wrap all rendered Firestore/TipTap HTML with .cet-content.
           Your mobile font-size rules in assets/css/tiptap.css will only apply
           to elements inside this wrapper (safe for the rest of the app). -->
      <div class="cet-content">
        <slot />
      </div>
    </main>

    <!-- Footer (mobile/desktop variants) -->
    <ClientOnly>
      <FooterSecondaryFooterMobile v-if="isMobile" />
      <FooterSecondaryFooter v-else />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

/**
 * Tailwind 'sm' breakpoint = 640px.
 * We consider mobile when viewport is <= 639px.
 */
const isMobile = useMediaQuery('(max-width: 639px)')
</script>
