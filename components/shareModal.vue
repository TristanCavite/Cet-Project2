<template>
    <main class="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50" @mousedown="handleOutsideClick">
        <div class="w-11/12 h-auto pb-4 bg-white rounded-lg md:w-96"  ref="modalRef">
            <div class="flex justify-end pt-2 pr-4">
                <UiButton class="bg-transparent hover:bg-transparent" @click="$emit('close')">
                    <X class="text-black"/>
                </UiButton>
            </div>
            <div class="flex flex-col justify-start pl-4">
                <span class="text-xl font-bold">Share</span>
                <span class="text-xs font-semibold">Choose a platform or copy the link</span>
            </div>
            <div class="px-4 mt-2">
                <div class="flex items-center w-full py-1 pl-2 bg-green-400 rounded-lg">
                    <span class="text-xs font-normal">Share via device...</span>
                </div>
            </div>
            <div class="flex flex-row justify-center pl-4 mt-2 space-x-8">
                <div class="flex items-center justify-center bg-blue-900 rounded-full size-10">
                    <a :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`"
                        target="_blank"
                        rel="noopener noreferrer"> 
                        <Facebook class="text-white" />
                    </a>
                </div>
                <div class="flex items-center justify-center bg-red-900 rounded-full size-10">
                    <a :href="`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl + '\n\n' + shareText)}`">
                        <Mail class="text-white"/>
                    </a>
                </div>
                <div class="flex items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 size-10">
                    <a :href="`mailto:?subject=Check this out&body=${encodeURIComponent(shareUrl)}`"
                        target="_blank"
                        rel="noopener noreferrer">
                        <Instagram  class="text-white"/>
                    </a>
                </div>
            </div>
            <div class="px-4 mt-10">
                <div class="flex items-center justify-between flex-shrink-0 w-full pl-2 text-black bg-gray-300 rounded-lg">
                    <span  :title="shareUrl"> {{ shareUrl }}</span>
                    <UiButton  @click="copyShareUrl" class="bg-green-600 hover:bg-green-700 hover:scale-105">
                        {{ copied ? 'Copied!' : 'Copy Link' }}
                    </UiButton>   
                </div>
            </div>
        </div>
    </main> 
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Facebook, Mail, Instagram} from "lucide-vue-next";
import { X } from 'lucide-vue-next'
import { useRoute, useRequestURL, useRuntimeConfig } from '#imports'

const props = defineProps<{
  profile?: { id?: string; fullName?: string; name?: string }
  showDelete?: boolean
}>()

const emit = defineEmits(['close', 'remove'])
const modalRef = ref<HTMLElement|null>(null)

function handleOutsideClick(event: MouseEvent) {
  // @ts-ignore
  if (modalRef.value && !modalRef.value.contains(event.target)) {
    emit('close')
  }
}

const route = useRoute()
const runtime = useRuntimeConfig()
const copied = ref(false)

const origin = (runtime.public?.SITE_URL as string | undefined) || useRequestURL().origin
const pathForShare = computed(() =>
  props.profile?.id ? `/about/dept_personels/${props.profile.id}` : route.fullPath
)
const shareUrl = computed(() => new URL(pathForShare.value, origin).href)

async function copyShareUrl() {
  await navigator.clipboard.writeText(shareUrl.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}

const shareTitle = computed(() => (props.profile?.fullName || props.profile?.name || 'CET VSU'))
const shareText  = computed(() => `Check this profile: ${shareTitle.value}`)

// Web Share API (works on mobile/browsers that support it)
async function shareNative() {
  if (navigator.share) {
    try {
      await navigator.share({ title: shareTitle.value, text: shareText.value, url: shareUrl.value })
    } catch { /* user canceled */ }
  } else {
    await copyShareUrl()
  }
}
</script>

<style>
/* * {
    outline: 1px solid red;
} */
</style>