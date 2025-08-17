<template>
  <main class="bg-white">
    <!-- Banner -->
    <div class="relative flex items-center w-full font-playfair">
      <img :src="section?.coverImageUrl || '/images/cet_facilities.jpg'" alt="Facilities Banner" class="object-cover w-full h-44 md:h-128" />
      <div class="absolute top-28 md:top-40 left-6 md:left-[120px] px-4 py-4 bg-gray-700/90">
        <span class="text-xl text-white md:text-6xl">Facilities</span>
      </div>
    </div>

    <!-- Content Box -->
    <div class="w-full h-auto pt-10 pb-10 mx-auto md:w-3/4">
      <!-- Loading -->
      <template v-if="pending">
        <UiSkeleton class="mx-auto mt-16 shadow-lg h-96 w-288 bg-stone-600" />
        <UiSkeleton class="mx-auto mt-4 shadow-lg h-96 w-288 bg-stone-600" />
        <UiSkeleton class="mx-auto mt-4 shadow-lg h-96 w-288 bg-stone-600" />
        <UiSkeleton class="mx-auto mt-4 mb-16 shadow-lg h-96 w-288 bg-stone-600" />
      </template>

      <!-- Loaded Content -->
      <div v-else v-html="section?.content" class="max-w-5xl mx-auto prose" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { doc } from 'firebase/firestore'
import { useDocument } from 'vuefire'
import { useFirestore } from 'vuefire'

definePageMeta({
  layout: 'custom',
})

const db = useFirestore()
const { data: section, pending } = useDocument(
  doc(db, 'about_sections', 'facilities')
)
</script>
