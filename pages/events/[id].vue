<template>
  <!-- Full-page section with gray background -->
  <section class="min-h-screen bg-gray-100 pt-28 px-4 pb-20">
    <!-- White content box -->
    <div class="max-w-5xl mx-auto bg-white p-10 rounded-xl shadow-md">
      <!-- Title -->
      <h1 class="text-3xl font-bold text-maroon mb-2">{{ event.title }}</h1>

      <!-- Date -->
      <p class="text-sm text-gray-600 mb-6">
        {{ formatDate(event.date) }}
      </p>

      <!-- Carousel -->
      <div v-if="coverImages.length" class="relative overflow-hidden rounded-xl mb-8">
        <div
          class="flex transition-transform duration-700 ease-in-out"
          :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
        >
          <div
            v-for="(img, index) in coverImages"
            :key="index"
            class="flex-shrink-0 w-full h-[400px]"
          >
            <img
              :src="img"
              class="w-full h-full object-cover"
              :alt="`Slide ${index + 1}`"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Arrows -->
        <button
          class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow"
          @click="prevSlide"
        >
          <ChevronLeft class="w-6 h-6 text-maroon" />
        </button>
        <button
          class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow"
          @click="nextSlide"
        >
          <ChevronRight class="w-6 h-6 text-maroon" />
        </button>

        <!-- Dots -->
        <div class="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          <span
            v-for="(img, index) in coverImages"
            :key="index"
            class="w-3 h-3 rounded-full"
            :class="currentSlide === index ? 'bg-maroon' : 'bg-gray-300'"
            @click="setSlide(index)"
          ></span>
        </div>
      </div>

      <!-- Description -->
      <p class="text-lg text-gray-800 mb-6">{{ event.description }}</p>

      <!-- Rich HTML Content -->
      <div
        v-html="event.content"
        class="prose max-w-none prose-img:rounded prose-p:text-justify"
      />

      <!-- Back Button -->
      <div class="mt-10">
        <NuxtLink
          to="/"
          class="inline-block text-sm font-semibold text-white bg-maroon hover:bg-red-900 transition px-5 py-2 rounded shadow"
        >
          Back to Home
        </NuxtLink>
      </div>
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFirestore } from 'vuefire'
import { doc, getDoc } from 'firebase/firestore'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

definePageMeta({
    layout: "custom",
});
const db = useFirestore()
const route = useRoute()

const event = ref<any>({})
const coverImages = ref<string[]>([])
const currentSlide = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

const loadEvent = async () => {
  const id = route.params.id as string
  const snap = await getDoc(doc(db, 'events', id))
  if (snap.exists()) {
    event.value = snap.data()
    coverImages.value = event.value.coverImages || []
  }
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

const nextSlide = () => {
  if (coverImages.value.length)
    currentSlide.value = (currentSlide.value + 1) % coverImages.value.length
}

const prevSlide = () => {
  if (coverImages.value.length)
    currentSlide.value =
      (currentSlide.value - 1 + coverImages.value.length) % coverImages.value.length
}

const setSlide = (index: number) => {
  currentSlide.value = index
}

onMounted(() => {
  loadEvent()
  intervalId = setInterval(nextSlide, 4000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>
