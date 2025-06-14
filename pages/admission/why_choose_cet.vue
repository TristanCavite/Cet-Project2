<template>
  <main class="pb-4 bg-stone-200">
    <!-- Header with dynamic cover image -->
    <div class="relative flex items-center w-full border-b-2 font-playfair">
      <img
        :src="admissionData?.coverImageUrl || '/images/fallback.jpg'"
        alt="Why Choose VSU Cover"
        class="object-cover w-full h-128"
      />
      <div class="absolute flex items-center left-[120px] h-28 w-96 bg-gray-700 bg-opacity-90">
        <span class="pl-5 text-6xl text-white">Why Choose VSU?</span>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="h-auto mx-auto mt-16 mb-16 border-2 shadow-2xl w-304 bg-neutral-50">
      <!-- Video Section -->
      <div class="mx-auto mt-4 h-128 w-288">
        <!-- YouTube Embed -->
        <iframe
          v-if="admissionData?.videoUrl && admissionData.videoUrl.includes('youtube.com')"
          :src="getYoutubeEmbedUrl(admissionData.videoUrl)"
          frameborder="0"
          allowfullscreen
          class="w-full h-full"
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
