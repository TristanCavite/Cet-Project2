<template>
  <main class="pb-4 bg-white">
    <!-- Header with dynamic cover image -->
    <div class="relative flex items-center w-full font-playfair">
      <img
        :src="admissionData?.coverImageUrl || '/images/fallback.jpg'"
        alt="Why Choose VSU Cover"
        class="object-cover w-full h-44 md:h-128"
      />
      <div class="absolute top-28 md:top-40 left-6 md:left-[120px] px-4 py-4 bg-gray-700/90">
        <span class="text-xl text-white md:text-6xl">Why Choose VSU?</span>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="w-3/4 h-auto mx-auto mt-10 mb-12 md:mt-16">
      <!-- Video Section -->
      <div class="w-full h-auto p-2 md:mx-auto md:h-128 md:w-3/4 rounded-xl">
        <!-- YouTube Embed -->
        <iframe
          v-if="admissionData?.videoUrl && admissionData.videoUrl.includes('youtube.com')"
          :src="getYoutubeEmbedUrl(admissionData.videoUrl)"
          frameborder="0"
          allowfullscreen
          class="w-full h-56 rounded-md object-fit md:h-full"
        ></iframe>

        <!-- Fallback for direct video URLs (e.g., .mp4 from Firebase Storage) -->
        <video
          v-else-if="admissionData?.videoUrl"
          :src="admissionData.videoUrl"
          controls
          preload="auto"
          playsinline
          class="w-full h-full object-fit"
        ></video>
      </div>

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

// Fetch from: admission_sections > why_choose_vsu
const { data: admissionData } = useDocument(
  doc(db, 'admission_sections', 'why_choose_vsu')
)

// YouTube embed conversion
function getYoutubeEmbedUrl(url: string): string {
  try {
    const videoId = new URL(url).searchParams.get('v')
    return `https://www.youtube.com/embed/${videoId}`
  } catch (e) {
    console.error('Invalid YouTube URL:', url)
    return ''
  }
}
</script>

<script lang="ts">
definePageMeta({
  layout: 'custom',
})
</script>
