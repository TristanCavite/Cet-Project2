<template>
  <main class="bg-white">
    <!-- Header with dynamic cover image -->
    <div class="relative flex items-center w-full font-playfair">
      <img
        :src="aboutData?.coverImageUrl || '/images/fallback.jpg'"
        alt="The College Cover"
        class="object-cover w-full h-44 md:h-128"
      />
      <div class="absolute top-16 md:top-40 left-6 md:left-[120px] md:px-4 md:py-4 bg-gray-700/90 px-2 py-2">
        <span class="text-xl text-white md:text-6xl">The College</span>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="w-full h-auto mx-auto mt-10 md:w-3/4">
      <!-- Video Section -->
      <div class="w-full h-auto p-2 md:mx-auto md:h-128 md:w-3/4 rounded-xl">
        <!-- YouTube Embed -->
        <iframe
          v-if="aboutData?.videoUrl && aboutData.videoUrl.includes('youtube.com')"
          :src="getYoutubeEmbedUrl(aboutData.videoUrl)"
          frameborder="0"
          allowfullscreen
          class="w-full h-56 rounded-md object-fit md:h-full "
        ></iframe>

        <!-- Fallback for direct video URLs (e.g., .mp4 from Firebase Storage) -->
        <video
          v-else-if="aboutData?.videoUrl"
          :src="aboutData.videoUrl"
          controls
          preload="auto"
          playsinline
          class="object-cover w-full h-56 rounded-md md:h-full"
        ></video>
      </div>

      <!-- Rich Text Content -->
      <div
        v-html="aboutData?.content"
        class="p-10 leading-relaxed"
      ></div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useDocument } from 'vuefire'
import { doc } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

// Get Firestore instance
const db = useFirestore()

// Retrieve document from Firestore: about_sections > the_college
const { data: aboutData } = useDocument(
  doc(db, 'about_sections', 'the_college')
)

// Function to convert normal YouTube links to embed format
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
