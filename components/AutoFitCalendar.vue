<!-- components/AutoFitCalendar.vue -->
<template>
  <div ref="wrap" class="relative w-full" :style="{ height: scaledHeight + 'px' }">
    <div
      ref="inner"
      class="absolute left-0 top-0 origin-top-left"
      :style="{ transform: `scale(${scale})` }"
    >
      <UiCalendar
        class="w-max !m-0 !p-0 calendar-tight"
        :attributes="attributes"
        v-model:selectedDate="model"
        @date-click="onDateClick"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, onUnmounted, watch, computed } from 'vue'

const props = defineProps<{
  attributes?: any[]
  selectedDate?: Date | null          // ← changed
}>()

const emit = defineEmits<{
  (e: 'update:selectedDate', v: Date | null): void   // ← changed
  (e: 'date-click', v: Date): void
}>()

// v-model bridge for selectedDate
const model = computed<Date | null>({
  get: () => props.selectedDate ?? null,            // ← changed
  set: (v) => emit('update:selectedDate', v),       // ← changed
})

function onDateClick(d: Date) {
  emit('date-click', d)
}

/** Auto-fit scale */
const wrap = ref<HTMLElement | null>(null)
const inner = ref<HTMLElement | null>(null)
const scale = ref(1)
const scaledHeight = ref(0)
let ro: ResizeObserver | null = null

async function fit() {
  await nextTick()
  const w = wrap.value, i = inner.value
  if (!w || !i) return
  i.style.transform = 'scale(1)'
  await nextTick()
  const cal = i.firstElementChild as HTMLElement | null
  if (!cal) return
  const { width: natW, height: natH } = cal.getBoundingClientRect()
  const targetW = w.clientWidth || natW || 1
  const s = natW ? targetW / natW : 1
  scale.value = s
  scaledHeight.value = Math.ceil(natH * s)
  i.style.transform = `scale(${s})`
}

onMounted(() => {
  fit()
  ro = new ResizeObserver(() => fit())
  if (wrap.value) ro.observe(wrap.value)
})
onUnmounted(() => {
  if (ro && wrap.value) ro.unobserve(wrap.value)
  ro = null
})

watch(() => props.attributes, () => fit(), { deep: true })
watch(() => props.selectedDate, () => fit())        // ← changed
</script>

<style scoped>
:deep(.calendar-tight){ padding:0 !important; margin:0 !important; }
:deep(.calendar-tight > *){ padding:0 !important; margin:0 !important; }
:deep(.vc-container){ padding:0 !important; box-shadow:none !important; border:none !important; }
</style>
