<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <!-- Back Button -->
    <UiButton
      class="mb-4 text-maroon bg-white border border-maroon hover:bg-maroon hover:text-white transition"
      @click="goBack"
    >
      ← Back to News
    </UiButton>

    <!-- Loading / Error -->
    <div v-if="pending" class="text-gray-500">Loading…</div>
    <div v-else-if="error" class="text-red-600">This article was not found.</div>

    <!-- Content -->
    <template v-else>
      <img
        v-if="news?.imageUrl"
        :src="news.imageUrl"
        class="w-full max-h-[400px] object-cover rounded"
        alt="Cover image"
      />

      <h1 class="text-3xl font-bold text-maroon">{{ news?.title }}</h1>

      <div class="text-sm text-gray-500">
        <span>By {{ news?.author || 'Unknown' }}</span> |
        <span>{{ formattedDate }}</span>
      </div>

      <p class="text-lg text-gray-700">{{ news?.description }}</p>

      <div class="prose max-w-none" v-html="news?.content" />
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'custom' })

import { useRoute, useRouter } from 'vue-router'
import { useFirestore } from 'vuefire'
import { doc, getDoc } from 'firebase/firestore'
import { computed } from 'vue'

/** ---------- Types ---------- */
type FireTimestampLike =
  | { toDate?: () => Date; seconds?: number }
  | Date
  | string
  | number
  | null
  | undefined

interface NewsDoc {
  id: string
  title?: string
  author?: string
  description?: string
  content?: string
  imageUrl?: string
  createdAt?: FireTimestampLike
}

/** ---------- Routing / DB ---------- */
const route = useRoute()
const router = useRouter()
const db = useFirestore()
const id = route.params.id as string

/** ---------- Fetch on server (SSR) ---------- */
const { data: news, pending, error } = await useAsyncData<NewsDoc>(
  `news:${id}`,
  async () => {
    const snap = await getDoc(doc(db, 'news', id))
    if (!snap.exists()) {
      throw createError({ statusCode: 404, statusMessage: 'News not found' })
    }
    return { id, ...(snap.data() as Record<string, unknown>) } as NewsDoc
  },
  { server: true, lazy: false }
)

/** ---------- Date formatting (TS + SSR safe) ---------- */
const formattedDate = computed(() => {
  const ts = news.value?.createdAt as any
  if (!ts) return ''
  const d: Date =
    ts?.toDate?.() ??
    (typeof ts === 'object' && typeof ts.seconds === 'number'
      ? new Date(ts.seconds * 1000)
      : new Date(ts))
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
})

function goBack() {
  router.push('/news')
}

/** ---------- OpenGraph / Twitter meta ---------- */
const runtime = useRuntimeConfig()
const baseUrl = ((runtime.public as any)?.baseUrl as string | undefined) || ''

function makeAbs(pathOrUrl?: string) {
  if (!pathOrUrl) return ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const base = baseUrl.replace(/\/$/, '')
  return `${base}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`
}

useHead(() => {
  const title = news.value?.title ?? 'News'
  const desc = news.value?.description ?? ''
  const img = makeAbs(news.value?.imageUrl || '/og-default.jpg')
  const url = makeAbs(`/news/${id}`)

  return {
    title,
    meta: [
      { name: 'description', content: desc },

      // Open Graph
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: desc },
      { property: 'og:image', content: img },
      { property: 'og:url', content: url },

      // Twitter
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: desc },
      { name: 'twitter:image', content: img }
    ],
    link: [{ rel: 'canonical', href: url }]
  }
})
</script>

<style scoped>
.text-maroon { color: #740505; }
.border-maroon { border-color: #740505; }
.bg-maroon { background-color: #740505; }
</style>
