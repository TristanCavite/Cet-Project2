<template>
    <main>
        <UiButton @click.stop="openShare" class="inline-flex bg-green-700 hover:bg-green-800 hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-send-icon lucide-send size-5"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>
            Share..
        </UiButton>
        <ShareModal v-if="showShare && shareContent" :content="shareContent" @close="showShare = false"  />
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'

type Item = {
  id: string
  type: 'research'|'news'|'event'|'profile'
  slug?: string         
  url?: string 
  title?: string
  name?: string
  topic?: string
  excerpt?: string | null
  description?: string | null
  content?: string | null
}

type ShareContent = { url: string; title: string; excerpt?: string }
const { item } = defineProps<{ item: Item }>()
const route = useRoute()

const showShare = ref(false)
const shareContent = ref<ShareContent | null>(null)

const strip = (s?: any) =>
  s ? String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''

function inferBaseFromRoute(): string {
  const seg = route.path.replace(/^\/+/, '').split('/')[0] || ''
  if (seg === 'news')   return '/news/'
  if (seg === 'events') return '/events/'
  if (seg === 'about')  return '/about/dept_personels/'
  return '/research/'
}

function resolveUrl(i: Item): string {
  // prefer explicit url
  if (i.url) return i.url

  // fall back to slug or id
  const idOrSlug = i.slug ?? i.id
  if (!idOrSlug) return route.path  // ultimate fallback to avoid errors
  const baseByType =
  i.type === 'news'    ? '/news/' :
  i.type === 'event'   ? '/events/' :
  i.type === 'profile' ? '/about/dept_personels/' :
                        '/research/'
  
  const base = baseByType ?? inferBaseFromRoute()
  return base + idOrSlug
}

function openShare() {
  const url = resolveUrl(item)
  const title = item.title ?? 'Share'
  const raw = item.excerpt ?? item.description ?? item.content ?? ''
  const text = strip(raw)
  const excerpt = text.length > 220 ? text.slice(0,217)+'…' : text
  shareContent.value = { url, title, excerpt }
  showShare.value = true
}
</script>