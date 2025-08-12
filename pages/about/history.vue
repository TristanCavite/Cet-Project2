<template>
  <main class="pb-4 bg-stone-200">
    <!-- ▸ Hero with dynamic cover image from Firestore -->
    <div class="relative flex items-center w-full border-b-2 font-playfair ">
      <!-- ✅ Use Firestore cover image; fallback to previous static asset -->
      <img
        :src="coverImage"
        alt="CET History cover"
        class="object-cover w-full h-44 md:h-128"
      />

      <!-- Title overlay kept as-is -->
      <div
        class="absolute flex items-center top-28 md:top-40 left-6 md:left-[120px] h-10 w-40 md:h-28 md:w-96 bg-gray-700/90 "
      >
        <span class="pl-2 text-xl text-white md:pl-5 md:text-6xl">History</span>
      </div>
    </div>

    <!-- ▸ Content card -->
    <div
      class="w-full h-auto mx-auto mt-10 mb-12 border-2 shadow-2xl md:mt-16 md:w-304 bg-neutral-50"
    >
    
      <!-- ✅ Render rich HTML from Firestore -->
      <div
        class="m-8 text-base font-medium md:m-10 md:text-lg font-roboto prose max-w-none"
        v-html="contentHtml"
      />

      <!-- (Optional) Tiny fallback when not yet loaded and no content -->
      <div v-if="!contentHtml" class="m-8 md:m-10 text-gray-500">
        Loading…
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">

definePageMeta({ layout: 'custom' })

import { computed } from 'vue'
import { doc } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'

// Get Firestore instance via VueFire
const db = useFirestore()

// Reactive Firestore document for the History section
const historyDoc = useDocument(doc(db, 'about_sections', 'history'))

// Cover image with safe fallback to the old static asset
const coverImage = computed(
  () => historyDoc.value?.coverImageUrl || '/images/cet_history.jpg'
)

// Rich HTML content (already sanitized/controlled by your admin editor)
const contentHtml = computed(() => historyDoc.value?.content || '')
</script>
