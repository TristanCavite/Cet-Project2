<template>
  <main class="pb-4 bg-white">
    <!-- Header with dynamic cover image -->
    <div class="relative flex items-center w-full font-playfair">
      <img
        :src="admissionData?.coverImageUrl || '/images/fallback.jpg'"
        alt="Undergraduate Cover"
        class="object-cover w-full h-44 md:h-128"
      />
      <div class="absolute top-16 md:top-40 left-6 md:left-[120px] md:px-4 md:py-4 px-2 py-2 bg-gray-700/90">
        <span class="text-xl text-white md:text-6xl">Undergraduate</span>
      </div>
    </div>

      <!-- Main Content Container -->
    <div class="w-3/4 mx-auto mt-10 mb-12 md:mt-16">
      <!-- Rich Text Content -->
      <div
        v-html="admissionData?.content"
        class="leading-relaxed"
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
