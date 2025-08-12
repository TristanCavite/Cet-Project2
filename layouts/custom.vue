<template>
  <div class="flex min-h-screen flex-col">
    <!-- Wrapping in ClientOnly avoids any SSR hydration mismatch
         when the initial server guess differs from the client width -->
    <ClientOnly>
      <NavbarMobile v-if="isMobile" />
      <NavbarMain v-else />
      <template #fallback>
        <!-- (optional) simple skeleton while hydrating -->
        <div class="h-[135px] w-full bg-neutral-100"></div>
      </template>
    </ClientOnly>

    <main class="flex-1 pt-[135px]">
      <slot />
    </main>

    <ClientOnly>
      <FooterSecondaryFooterMobile v-if="isMobile" />
      <FooterSecondaryFooter v-else />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useMediaQuery } from '@vueuse/core'

// Tailwind 'sm' breakpoint is 640px → mobile when <= 639px
const isMobile = useMediaQuery('(max-width: 639px)')
</script>
