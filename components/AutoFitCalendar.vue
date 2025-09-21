<template>
  <div
    ref="wrap"
    class="relative w-full overflow-y-hidden overflow-x-visible"
    :style="{
      height: scaledHeight + 'px',
      visibility: ready ? 'visible' : 'hidden',
      opacity: ready ? 1 : 0,
      transition: 'opacity 180ms ease'
    }"
  >
    <div
      ref="inner"
      class="absolute left-1/2 top-0 origin-top"
      :style="{
        transform: `translateX(-50%) scale(${scale})`,
        width: (lockWidth ? baseNaturalWidth + 'px' : 'auto'),
        height: (lockHeight ? baseNaturalHeight + 'px' : 'auto'),
        transformOrigin: 'top center',
        willChange: 'transform'
      }"
    >
      <UiCalendar
        class="calendar-tight !m-0 w-max !p-0"
        :attributes="attributes"
        :trim-weeks="false"
        v-model:selectedDate="model"
        @date-click="onDateClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const STORAGE_KEY_W = 'AutoFitCalendar:maxW:v1'
const STORAGE_KEY_H = 'AutoFitCalendar:maxH:v1'

const props = withDefaults(defineProps<{
  attributes?: any[]
  selectedDate?: Date | null
  maxHeight?: number
  lockWidth?: boolean
  lockHeight?: boolean
  maxScale?: number
}>(), {
  lockWidth: true,
  lockHeight: true,
  maxScale: 1.12
})

const emit = defineEmits<{
  (e: 'update:selectedDate', v: Date | null): void
  (e: 'date-click', v: Date): void
}>()

const model = computed<Date | null>({
  get: () => props.selectedDate ?? null,
  set: (v) => emit('update:selectedDate', v),
})

function onDateClick(d: Date) { emit('date-click', d) }

const wrap = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const scale = ref(1)
const scaledHeight = ref(0)
const maxNaturalWidth  = ref(0)
const maxNaturalHeight = ref(0)
const baseNaturalWidth  = computed(() => Math.max(1, maxNaturalWidth.value))
const baseNaturalHeight = computed(() => Math.max(1, maxNaturalHeight.value))
const ready = ref(false)

let roWrap: ResizeObserver | null = null
let roCal: ResizeObserver | null = null

function getCalEl(): HTMLElement | null {
  return (inner.value?.firstElementChild as HTMLElement) ?? null
}

function loadBaselineFromStorage() {
  try {
    const sW = localStorage.getItem(STORAGE_KEY_W)
    const sH = localStorage.getItem(STORAGE_KEY_H)
    if (sW) {
      const n = parseInt(sW, 10)
      if (!Number.isNaN(n) && n > 0) maxNaturalWidth.value = n
    }
    if (sH) {
      const n2 = parseInt(sH, 10)
      if (!Number.isNaN(n2) && n2 > 0) maxNaturalHeight.value = n2
    }
  } catch (e) {}
}

function saveBaselineToStorage() {
  try {
    if (maxNaturalWidth.value && maxNaturalWidth.value > 0)
      localStorage.setItem(STORAGE_KEY_W, String(maxNaturalWidth.value))
    if (maxNaturalHeight.value && maxNaturalHeight.value > 0)
      localStorage.setItem(STORAGE_KEY_H, String(maxNaturalHeight.value))
  } catch (e) {}
}

async function fit() {
  await nextTick()
  const w = wrap.value
  const i = inner.value
  const cal = getCalEl()
  if (!w || !i || !cal) return

  i.style.transform = 'translateX(-50%) scale(1)'
  await nextTick()

  const rect = cal.getBoundingClientRect()
  const natW = Math.ceil(rect.width || 1)
  const natH = Math.ceil(rect.height || 1)

  if (props.lockWidth) {
    const prev = maxNaturalWidth.value || 0
    const next = Math.max(prev, natW)
    if (next !== prev) {
      maxNaturalWidth.value = next
      saveBaselineToStorage()
    }
  } else {
    maxNaturalWidth.value = natW
  }

  if (props.lockHeight) {
    const prevH = maxNaturalHeight.value || 0
    const nextH = Math.max(prevH, natH)
    if (nextH !== prevH) {
      maxNaturalHeight.value = nextH
      saveBaselineToStorage()
    }
  } else {
    maxNaturalHeight.value = natH
  }

  const baseW = props.lockWidth ? baseNaturalWidth.value : natW
  const baseH = props.lockHeight ? baseNaturalHeight.value : natH

  const targetW = w.clientWidth || baseW
  const EPS = 1.5
  const sW = (targetW - EPS) / baseW
  const sH = props.maxHeight ? (props.maxHeight / baseH) : Number.POSITIVE_INFINITY
  const s = Math.min(sW, sH, props.maxScale ?? 1.12)

  scale.value = s
  const h = Math.ceil(baseH * s)
  scaledHeight.value = props.maxHeight ? Math.min(h, props.maxHeight) : h

  i.style.transform = `translateX(-50%) scale(${s})`

  try { const calEl = getCalEl(); if (calEl) calEl.style.overflow = 'visible' } catch(e) {}
}

onMounted(async () => {
  loadBaselineFromStorage()
  if (document.fonts && typeof document.fonts.ready?.then === 'function') {
    try { await document.fonts.ready } catch (e) {}
  }
  await fit()
  ready.value = true

  roWrap = new ResizeObserver(() => fit())
  if (wrap.value) roWrap.observe(wrap.value)

  roCal = new ResizeObserver(() => fit())
  const cal = getCalEl()
  if (cal) roCal.observe(cal)

  window.addEventListener('resize', fit)
})

onUnmounted(() => {
  if (roWrap && wrap.value) roWrap.unobserve(wrap.value)
  if (roCal) {
    const cal = getCalEl()
    if (cal) roCal.unobserve(cal)
  }
  roWrap = roCal = null
  window.removeEventListener('resize', fit)
})

watch(() => props.attributes, () => fit(), { deep: true })
watch(() => props.selectedDate, () => fit())
watch(() => props.maxHeight, () => fit())
watch(() => props.lockWidth,  () => { maxNaturalWidth.value  = 0; saveBaselineToStorage(); fit() })
watch(() => props.lockHeight, () => { maxNaturalHeight.value = 0; saveBaselineToStorage(); fit() })
</script>

<style scoped>
:deep(.calendar-tight){ padding:0 !important; margin:0 !important; }
:deep(.calendar-tight > *){ padding:0 !important; margin:0 !important; }
:deep(.vc-container){ padding:0 !important; box-shadow:none !important; border:none !important; }
</style>
