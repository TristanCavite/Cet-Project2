<template>
  <!-- Full-page section with gray background -->
  <section class="min-h-screen px-2 pb-20 bg-gray-100 md:px-4 pt-28">
    <!-- White content box -->
    <div class="max-w-5xl p-5 mx-auto bg-white shadow-md md:p-10 rounded-xl">
      <!-- Title -->
      <h1 class="mb-2 text-3xl font-bold text-maroon">{{ event.title }}</h1>

      <!-- Date -->
      <p class="mb-6 text-sm text-gray-600">
        {{ formatDate(event.date) }}
      </p>

      <!-- Carousel -->
      <div v-if="coverImages.length" class="relative mb-8 overflow-hidden rounded-xl">
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
              class="object-cover w-full h-full"
              :alt="`Slide ${index + 1}`"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Arrows -->
        <button
          class="absolute z-10 p-2 transform -translate-y-1/2 rounded-full shadow left-4 top-1/2 bg-white/80 hover:bg-white"
          @click="prevSlide"
        >
          <ChevronLeft class="md:size-6 size-4 text-maroon" />
        </button>
        <button
          class="absolute z-10 p-2 transform -translate-y-1/2 rounded-full shadow right-4 top-1/2 bg-white/80 hover:bg-white"
          @click="nextSlide"
        >
          <ChevronRight class="md:size-6 size-4 text-maroon" />
        </button>

        <!-- Dots -->
        <div class="absolute z-10 flex gap-2 transform -translate-x-1/2 bottom-3 left-1/2">
          <span
            v-for="(img, index) in coverImages"
            :key="index"
            class="rounded-full md:size-3 size-2"
            :class="currentSlide === index ? 'bg-maroon' : 'bg-gray-300'"
            @click="setSlide(index)"
          ></span>
        </div>
      </div>

      <!-- Description -->
      <p class="mb-6 text-lg text-gray-800">{{ event.description }}</p>

      <!-- Rich HTML Content -->
      <div
        v-html="event.content"
        class="prose max-w-none prose-img:rounded prose-p:text-justify"
      />

      <!-- Back Button -->
      <div class="mt-10">
        <NuxtLink
          to="/"
          class="inline-block px-3 py-1 text-sm font-semibold text-white transition rounded shadow md:py-2 md:px-5 bg-maroon hover:bg-red-900"
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
