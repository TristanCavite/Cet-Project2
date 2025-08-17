<template>
  <main class="pb-4 bg-white">
    <!-- Header with dynamic cover image -->
    <div class="relative flex items-center w-full font-playfair">
      <img
        :src="admissionData?.coverImageUrl || '/images/fallback.jpg'"
        alt="Graduate Cover"
        class="object-cover w-full h-44 md:h-128"
      />
      <div class="absolute top-28 md:top-40 left-6 md:left-[120px] px-4 py-4 bg-gray-700/90">
        <span class="text-xl text-white md:text-6xl">Graduate</span>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="w-3/4 h-auto mx-auto mt-10 mb-12 md:mt-16">
      <!-- Rich Text Content -->
      <div
        v-html="admissionData?.content"
        class="px-10 mt-10 mb-5 space-y-4 leading-relaxed text-justify text-gray-800 font-roboto"
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

// Fetch from: admission_sections > graduate
const { data: admissionData } = useDocument(
  doc(db, 'admission_sections', 'graduate')
)
</script>

<script lang="ts">
definePageMeta({
  layout: 'custom',
})
</script>
