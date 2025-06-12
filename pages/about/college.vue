<template>
  <main class="pb-4 bg-stone-200">
    <!-- Header with dynamic cover image -->
    <div class="relative flex items-center w-full border-b-2 font-playfair">
      <img
        :src="aboutData?.coverImageUrl || '/images/fallback.jpg'"
        alt="The College Cover"
        class="object-cover w-full h-128"
      />
      <div class="absolute flex items-center left-[120px] h-28 w-96 bg-gray-700 bg-opacity-90">
        <span class="pl-5 text-6xl text-white">The College</span>
      </div>
    </div>

    <!-- Main Card -->
    <div class="h-auto mx-auto mt-16 mb-16 border-2 shadow-2xl w-304 bg-neutral-50">
      <!-- Video -->
      <div class="mx-auto mt-4 h-128 w-288">
        <video
          v-if="aboutData?.videoUrl"
          :src="aboutData.videoUrl"
          controls
          preload="auto"
          playsinline
          class="w-full h-full object-fit"
        ></video>
      </div>

      <!-- Rich Content from Firestore -->
      <div class="mt-10 mb-5 px-10 text-lg font-medium font-roboto">
        <div v-html="aboutData?.content" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useDocument } from 'vuefire'
import { doc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

// Firestore reference
const db = useFirestore()

// Get the document from about_sections > the_college
const { data: aboutData } = useDocument(
  doc(db, 'about_sections', 'the_college')
)
</script>

<script lang="ts">
definePageMeta({
  layout: 'custom',
})
</script>
