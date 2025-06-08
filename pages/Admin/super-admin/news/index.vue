<template>
  <div class="p-6 max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Manage News</h1>
      <UiButton
        class="bg-maroon text-white hover:opacity-90"
        @click="$router.push('/admin/super-admin/news/add_news')"
      >
        + Add News
      </UiButton>
    </div>

    <!-- News list -->
    <div v-if="news.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in news"
        :key="item.id"
        class="bg-white border rounded shadow hover:shadow-md transition p-4 space-y-2"
      >
        <!-- Cover image -->
        <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-48 object-cover rounded" />

        <!-- Title -->
        <h2 class="text-xl font-bold text-maroon">{{ item.title }}</h2>

        <!-- Author & Date -->
        <div class="text-sm text-gray-500">
          <span>By {{ item.author || 'Unknown' }}</span> |
          <span>{{ formatDate(item.createdAt) }}</span>
        </div>

        <!-- Description -->
        <p class="text-sm text-gray-700">{{ item.description }}</p>

        <!-- Read more -->
        <UiButton
          variant="outline"
          class="text-maroon border-maroon hover:bg-maroon hover:text-white"
          @click="readMore(item.id)"
        >
          Read more...
        </UiButton>
      </div>
    </div>

    <!-- Placeholder -->
    <div v-else class="text-center text-gray-500 mt-10 border rounded p-10">
      No news items yet. Click “+ Add News” to create your first post.
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'super-admin' })

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFirestore } from 'vuefire'
import {
  collection,
  getDocs,
  query,
  where,
  Timestamp,
  QueryDocumentSnapshot
} from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
const db = useFirestore()
const router = useRouter()
const news = ref<any[]>([])

onMounted(async () => {
  const q = query(collection(db, 'news'), where('published', '==', true))
  const snap = await getDocs(q)
  news.value = snap.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    id: doc.id,
    ...doc.data()
  }))
})

function readMore(id: string) {
  router.push(`/Admin/super-admin/news/${id}`)
}

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
.bg-maroon {
  background-color: #740505;
}
.text-maroon {
  color: #740505;
}
.border-maroon {
  border-color: #740505;
}
</style>
