<template>
    <main class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50" @mousedown="handleOutsideClick">
        <div class="w-11/12 h-auto pb-4 bg-white rounded-lg md:w-96"  ref="modalRef">
            <div class="flex justify-end">
                <UiButton class="bg-transparent hover:bg-transparent hover:scale-125" @click="$emit('close')">
                    <X class="text-black"/>
                </UiButton>
            </div>
            <div class="flex flex-col justify-start pl-4">
                <span class="text-xl font-bold">Share</span>
                <span class="text-xs font-semibold">Choose a platform or copy the link</span>
            </div>
            <div class="px-4 mt-2">
                <div class="flex items-center w-full py-1 pl-2 bg-green-400 rounded">
                    <span class="text-xs font-normal">Share via device...</span>
                </div>
            </div>
            <div class="flex flex-row justify-center pl-4 mt-2 space-x-8">
                <div>
                    <div class="flex items-center justify-center mx-auto bg-blue-900 rounded-full size-10">
                        <a :href="facebookHref"
                            target="_blank"
                            rel="noopener noreferrer"> 
                            <Facebook class="text-white" />
                        </a>
                    </div>
                    <span class="text-sm font-medium text-center">Facebook</span>
                </div>
                <div>
                    <div class="flex items-center justify-center bg-red-900 rounded-full size-10">
                        <a :href="mailtoHref">
                            <Mail class="text-white"/>
                        </a>
                    </div>
                    <span class="text-sm font-medium text-center">Gmail</span>
                </div>
                <div class="">
                    <div class="flex items-center justify-center mx-auto bg-blue-500 rounded-full size-10">
                        <a :href="messengerHref"
                            target="_blank"
                            rel="noopener noreferrer">
                            <Zap class="flex justify-center text-white -rotate-45 -scale-x-100 fill-white"/>
                        </a>
                    </div>
                    <span class="text-sm font-medium text-center">Messenger</span>
                </div>
            </div>
            <div class="px-4 mt-10">
                <div class="flex items-center justify-between flex-shrink-0 w-full pl-2 text-black bg-gray-300 rounded-lg">
                    <span  :title="shareUrl" class="truncate"> {{ shareUrl }} </span>
                    <UiButton  @click="copyShareUrl" class="bg-green-600 hover:bg-green-700 hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-icon lucide-link size-5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        {{ copied ? 'Copied!' : 'Copy Link' }}
                    </UiButton>   
                </div>
            </div>
        </div>
    </main> 
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Facebook, Mail, Zap} from "lucide-vue-next";
import { X } from 'lucide-vue-next'
import { useRoute, useRequestURL, useRuntimeConfig } from '#imports'

type ShareContent = { url: string; title: string; excerpt?: string }

const props = defineProps<{ content: ShareContent
    copyMode?: 'url' | 'full' }>()

const emit = defineEmits(['close', 'remove'])
const modalRef = ref<HTMLElement|null>(null)

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as Node | null
  if (modalRef.value && target && !modalRef.value.contains(target)) {
    emit('close')
  }
}

const runtime = useRuntimeConfig()
const copied = ref(false)
const isClient = typeof window !== 'undefined'
const origin = (runtime.public?.SITE_URL as string | undefined) || useRequestURL().origin

const shareUrl = computed(() => new URL(props.content.url, origin).href)
const shareTitle = computed(() => props.content.title)
const shareText = computed(() => {
  const raw = (props.content.excerpt || '').replace(/\s+/g, ' ').trim()
  return raw ? `${shareTitle.value} — ${raw.length > 220 ? raw.slice(0, 217) + '…' : raw}` : shareTitle.value
})

const textToCopy = computed(() =>
  (props.copyMode ?? 'url') === 'full'
    ? `${shareText.value}\n\n${shareUrl.value}`
    : shareUrl.value
)

// --- Email ---
const mailtoHref = computed(() =>
  `mailto:?subject=${encodeURIComponent(shareTitle.value)}&body=${encodeURIComponent(`${shareText.value}\n\n${shareUrl.value}`)}`
)

// --- Facebook ---
const facebookHref = computed(() =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
)

// --- Messenger (fixed) ---
const FB_APP_ID = runtime.public?.FB_APP_ID as string | undefined
const redirectUrl = computed(() => new URL('/share/complete', origin).href) // MUST be whitelisted in your FB app
const isMobile = computed(
  () => isClient && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
)

const messengerHref = computed(() => {
  if (isMobile.value) {
    return `fb-messenger://share/?link=${encodeURIComponent(shareUrl.value)}`
  }
  if (FB_APP_ID) {
    return `https://www.facebook.com/dialog/send?app_id=${encodeURIComponent(
      FB_APP_ID
    )}&link=${encodeURIComponent(shareUrl.value)}&redirect_uri=${encodeURIComponent(
      redirectUrl.value
    )}&display=popup`
  }
  // Fallback if no app id is configured
  return facebookHref.value
})

async function copyShareUrl() {
  try {
    // Primary: async Clipboard API
    await navigator.clipboard.writeText(textToCopy.value)
    copied.value = true
  } catch {
    // Fallback for older/locked-down browsers
    const ta = document.createElement('textarea')
    ta.value = textToCopy.value
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-1000px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try { document.execCommand('copy') } 
    finally { document.body.removeChild(ta) }
    copied.value = true
  }
  setTimeout(() => (copied.value = false), 1500)
}

</script>

<style>
/* * {
    outline: 1px solid red;
} */
</style>