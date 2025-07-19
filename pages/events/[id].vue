<template>
  <!-- Full-page section with gray background -->
  <section class="min-h-screen px-2 pt-20 pb-10 bg-neutral-100 md:px-4">
    <!-- White content box -->
    <div class="max-w-5xl p-5 mx-auto bg-white shadow-xl md:p-10 rounded-xl">
      <div class="flex flex-col items-center">
        <!-- Title -->
        <span class="mb-2 font-sans text-3xl font-bold text-red-900"> {{ event.title }} </span>

        <!-- Date -->
        <span class="mb-6 font-serif text-xs text-gray-600"> {{ formatDate(event.date) }} </span>
      </div>

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
          <ChevronLeft class="text-red-900 md:size-6 size-4" />
        </button>
        <button
          class="absolute z-10 p-2 transform -translate-y-1/2 rounded-full shadow right-4 top-1/2 bg-white/80 hover:bg-white"
          @click="nextSlide"
        >
          <ChevronRight class="text-red-900 md:size-6 size-4" />
        </button>

        <!-- Dots -->
        <div class="absolute z-10 flex gap-2 transform -translate-x-1/2 bottom-3 left-1/2">
          <span
            v-for="(img, index) in coverImages"
            :key="index"
            class="rounded-full size-2"
            :class="currentSlide === index ? 'bg-red-900' : 'bg-gray-300'"
            @click="setSlide(index)"
          ></span>
        </div>
      </div>

      <div class="flex flex-col items-center">
        <!-- Description -->
        <span class="mb-6 text-lg text-gray-800">{{ event.description }}</span>
  
        <!-- Rich HTML Content -->
        <div
          v-html="event.content"
          class="prose max-w-none prose-img:rounded prose-p:text-justify"
        />
      </div>

      <div class="flex flex-col items-center mt-10">
        <!-- Back Button -->
        <div class="flex flex-row items-center justify-center pt-2 pb-2 pl-4 pr-4 bg-green-900 rounded-sm hover:bg-gray-300 w-fit">
          <NuxtLink
            to="/"
            class="text-sm font-semibold text-gray-100 transition rounded"
          >
          <span>BACK</span>
          </NuxtLink>
        </div>
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
</style>
