<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- Back to News Button -->
    <UiButton
      class="mb-4 text-maroon bg-white border border-maroon hover:bg-maroon hover:text-white transition duration-150"
      @click="goBackToIndex"
    >
      ← Back to News
    </UiButton>

    <!-- Edit Button -->
    <UiButton
      class="mb-4 ml-2 bg-maroon text-white hover:opacity-90 transition duration-150"
      @click="editNews"
    >
      ✏️ Edit
    </UiButton>

    <!-- Cover Image -->
    <img
      v-if="news?.imageUrl"
      :src="news.imageUrl"
      class="w-full max-h-[400px] object-cover rounded"
    />

    <!-- Title -->
    <h1 class="text-3xl font-bold text-maroon">{{ news?.title }}</h1>

    <!-- Author + Date -->
    <div class="text-sm text-gray-500">
      <span>By {{ news?.author || 'Unknown' }}</span> |
      <span>{{ formatDate(news?.createdAt) }}</span>
    </div>

    <!-- Description -->
    <p class="text-lg text-gray-700">{{ news?.description }}</p>

    <!-- Full Content -->
    <div class="prose max-w-none" v-html="news?.content" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: "auth",layout: 'super-admin' })

// Import Vue Router + Firebase helpers
import { useRoute, useRouter } from 'vue-router'
import { useFirestore } from 'vuefire'
import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { ref, onMounted } from 'vue'

// Composables
const route = useRoute()
const router = useRouter()
const db = useFirestore()

// Get news ID from route
const newsId = route.params.id as string
const news = ref<any>(null)


function goBackToIndex() {
  router.push('/Admin/super-admin/news')
}
// Fetch Firestore document on mount
onMounted(async () => {
  const snap = await getDoc(doc(db, 'news', newsId))
  if (snap.exists()) {
    news.value = snap.data()
  }
})

// Navigate to edit screen
function editNews() {
  router.push(`/Admin/super-admin/news/add_news?id=${newsId}`)
}

// Format timestamp to readable string
function formatDate(ts: Timestamp | null) {
  if (!ts?.toDate) return ''
  return ts.toDate().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.text-maroon {
  color: #740505;
}
.border-maroon {
  border-color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>
