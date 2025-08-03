<template>
  <main class="pb-4 bg-stone-200">
    <!-- Banner -->
    <div class="relative flex items-center w-full border-b-2 font-playfair">
      <img :src="section?.coverImageUrl || '/images/cet_facilities.jpg'" alt="Facilities Banner" class="object-cover w-full h-44 md:h-128" />
      <div class="absolute flex items-center top-28 md:top-40 left-6 md:left-[120px] h-10 w-40 md:h-28 md:w-96 bg-gray-700/90 ">
        <span class="pl-2 text-xl text-white md:pl-5 md:text-6xl">Facilities</span>
      </div>
    </div>

    <!-- Content Box -->
    <div class="w-full h-auto mx-auto mt-10 mb-12 border-2 shadow-2xl md:mt-16 md:w-304 bg-neutral-50">
      <!-- Loading -->
      <template v-if="pending">
        <UiSkeleton class="mx-auto mt-16 shadow-lg h-96 w-288 bg-stone-600" />
        <UiSkeleton class="mx-auto mt-4 shadow-lg h-96 w-288 bg-stone-600" />
        <UiSkeleton class="mx-auto mt-4 shadow-lg h-96 w-288 bg-stone-600" />
        <UiSkeleton class="mx-auto mt-4 mb-16 shadow-lg h-96 w-288 bg-stone-600" />
      </template>

      <!-- Loaded Content -->
      <div v-else v-html="section?.content" class="mx-auto prose max-w-none rounded-xl" />
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
