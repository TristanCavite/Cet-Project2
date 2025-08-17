<template>
  <main class="pb-4 bg-white">
    <!-- ▸ Hero with dynamic cover image from Firestore -->
    <div class="relative flex items-center w-full font-playfair ">
      <!-- ✅ Use Firestore cover image; fallback to previous static asset -->
      <img
        :src="coverImage"
        alt="CET History cover"
        class="object-cover w-full h-44 md:h-128"
      />

      <!-- Title overlay kept as-is -->
      <div
        class="absolute top-28 md:top-40 left-6 md:left-[120px] px-4 py-4 bg-gray-700/90"
      >
        <span class="text-xl text-white md:text-6xl">History</span>
      </div>
    </div>

    <!-- ▸ Content card -->
    <div class="pt-10 pb-10 mx-auto md:w-3/4">
      <!-- ✅ Render rich HTML from Firestore -->
      <div
        class="m-2 prose md:m-5 max-w-none"
        v-html="contentHtml"
      />

      <!-- (Optional) Tiny fallback when not yet loaded and no content -->
      <div v-if="!contentHtml" class="m-5">
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
