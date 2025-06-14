<template>
  <main class="pb-4 bg-stone-200">
    <!-- Header with dynamic cover image -->
    <div class="relative flex items-center w-full border-b-2 font-playfair">
      <img
        :src="admissionData?.coverImageUrl || '/images/fallback.jpg'"
        alt="Undergraduate Cover"
        class="object-cover w-full h-128"
      />
     <div class="absolute left-[120px] bg-gray-700 bg-opacity-90 px-6 py-3 rounded">
  <span class="text-6xl text-white leading-tight">Undergraduate</span>
</div>

    </div>

    <!-- Main Content Container -->
    <div class="h-auto mx-auto mt-16 mb-16 border-2 shadow-2xl w-304 bg-neutral-50">
      <!-- Rich Text Content -->
      <div
        v-html="admissionData?.content"
        class="mt-10 mb-5 px-10 text-gray-800 text-justify leading-relaxed space-y-4 font-roboto"
      ></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useDocument } from 'vuefire'
import { doc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

// Firestore setup
const db = useFirestore()

// Fetch from: admission_sections > undergraduate
const { data: admissionData } = useDocument(
  doc(db, 'admission_sections', 'undergraduate')
)
</script>

<script lang="ts">
definePageMeta({
  layout: 'custom',
})
</script>
