<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <!-- Back button -->
    <div class="mb-6">
      <UiButton
        variant="outline"
        class="border-maroon text-maroon hover:bg-maroon hover:text-white"
        @click="goBack"
      >
        <template #icon>
          <ArrowLeft class="w-4 h-4" />
        </template>
        Back to Research
      </UiButton>
    </div>

    <!-- Research Content -->
    <div v-if="research">
      <!-- Title -->
      <h1 class="mb-2 text-3xl font-bold text-maroon">{{ research.title }}</h1>

      <!-- Meta (Date • Department • Researchers) -->
      <div class="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600">
        <span>{{ formatDate(research.date) }}</span>

        <template v-if="deptName">
          <span class="text-gray-400">•</span>
          <span><span class="font-medium text-gray-700">Department:</span> {{ deptName }}</span>
        </template>

        <template v-if="research.researchers">
          <span class="text-gray-400">•</span>
          <span><span class="font-medium text-gray-700">Researchers:</span> {{ research.researchers }}</span>
        </template>
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
            class="h-[400px] w-full flex-shrink-0"
          >
            <img
              :src="img"
              class="h-full w-full object-cover"
              :alt="`Slide ${index + 1}`"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Arrows -->
        <button
          class="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/80 p-2 shadow hover:bg-white"
          @click="prevSlide"
          aria-label="Previous image"
        >
          <ChevronLeft class="h-6 w-6 text-maroon" />
        </button>
        <button
          class="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/80 p-2 shadow hover:bg-white"
          @click="nextSlide"
          aria-label="Next image"
        >
          <ChevronRight class="h-6 w-6 text-maroon" />
        </button>

        <!-- Dots -->
        <div class="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 transform flex gap-2">
          <span
            v-for="(_, index) in coverImages"
            :key="index"
            class="h-3 w-3 rounded-full"
            :class="currentSlide === index ? 'bg-maroon' : 'bg-gray-300'"
            @click="setSlide(index)"
          />
        </div>
      </div>

      <!-- Description -->
      <p class="mb-6 text-lg text-gray-800">{{ research.description }}</p>

      <!-- Rich Content -->
      <div
        v-html="research.content"
        class="prose max-w-none prose-img:rounded prose-p:text-justify"
      />
    </div>

    <div v-else class="mt-20 text-center text-gray-500">Loading research...</div>
  </div>
</template>

<script setup lang="ts">
// Public page — use default layout (no auth). If your site uses a custom public layout,
// you can set it here, e.g. definePageMeta({ layout: 'public' })

import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFirestore } from 'vuefire'
import { doc, getDoc } from 'firebase/firestore'
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-vue-next'

const db = useFirestore()
const route = useRoute()
const router = useRouter()

const research = ref<any>(null)
const coverImages = ref<string[]>([])
const currentSlide = ref(0)
const deptName = ref<string>('') // resolved department name
let intervalId: ReturnType<typeof setInterval> | null = null

async function loadDepartmentName(departmentId?: string) {
  if (!departmentId) return
  const snap = await getDoc(doc(db, 'departments', departmentId))
  if (snap.exists()) {
    const data: any = snap.data()
    deptName.value = data?.name ?? data?.departmentName ?? data?.title ?? ''
  }
}

async function loadResearch() {
  const id = route.params.id as string
  const snap = await getDoc(doc(db, 'researches', id))
  if (!snap.exists()) {
    // If not found, go back to list
    router.push('/research')
    return
  }
  research.value = snap.data()
  coverImages.value = research.value.coverImages || []
  await loadDepartmentName(research.value.departmentId)
}

function formatDate(iso: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function nextSlide() {
  if (coverImages.value.length) {
    currentSlide.value = (currentSlide.value + 1) % coverImages.value.length
  }
}
function prevSlide() {
  if (coverImages.value.length) {
    currentSlide.value =
      (currentSlide.value - 1 + coverImages.value.length) % coverImages.value.length
  }
}
function setSlide(index: number) {
  currentSlide.value = index
}

function goBack() {
  router.push('/research')
}

onMounted(() => {
  loadResearch()
  intervalId = setInterval(nextSlide, 4000)
})
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.text-maroon { color: #740505; }
.bg-maroon { background-color: #740505; }
.border-maroon { border-color: #740505; }
</style>
