<template>
  <main class="bg-stone-200 pb-8">
    <!-- Cover -->
    <div class="relative flex w-full items-center border-b-2 font-playfair">
      <img src="/images/cet.jpg" alt="Research Cover" class="h-44 w-full object-cover md:h-128" />
      <div
        class="absolute left-6 top-28 flex h-10 w-40 items-center bg-gray-700/90 md:left-[120px] md:top-40 md:h-28 md:w-96"
      >
        <span class="pl-2 text-xl text-white md:pl-5 md:text-6xl">Research</span>
      </div>
    </div>

    <!-- Filters -->
    <div class="mx-auto mt-4 flex max-w-6xl justify-end gap-4 px-4">
      <!-- Year -->
      <div class="relative" @click.stop="toggleYear">
        <div class="flex h-8 w-28 cursor-pointer items-center justify-center gap-1 border-2 border-gray-900 bg-white">
          <span class="text-sm text-gray-700">{{ selectedYearLabel }}</span>
          <ChevronDown class="h-4 w-4 text-black" />
        </div>
        <div v-if="showYears" class="absolute z-20 mt-2 max-h-72 w-36 overflow-auto rounded-md border bg-white shadow">
          <ul>
            <li class="cursor-pointer px-4 py-2 hover:bg-gray-100" @click.stop="selectYear('')">All Years</li>
            <li
              v-for="year in years"
              :key="year"
              class="cursor-pointer px-4 py-2 hover:bg-gray-100"
              @click.stop="selectYear(String(year))"
            >
              {{ year }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Department -->
      <div class="relative" @click.stop="toggleDepartments">
        <div class="flex h-8 w-40 cursor-pointer items-center justify-center gap-1 border-2 border-gray-900 bg-white">
          <span class="truncate text-sm text-gray-700">{{ selectedDeptLabel }}</span>
          <ChevronDown class="h-4 w-4 text-black" />
        </div>
        <div
          v-if="showDepartments"
          class="absolute z-20 mt-2 max-h-72 w-64 overflow-auto rounded-md border bg-white shadow"
        >
          <ul>
            <li class="cursor-pointer px-4 py-2 hover:bg-gray-100" @click.stop="selectDepartment('')">
              All Departments
            </li>
            <li
              v-for="dept in departments"
              :key="dept.id"
              class="cursor-pointer px-4 py-2 hover:bg-gray-100"
              @click.stop="selectDepartment(dept.id)"
            >
              {{ dept.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- One-column list -->
    <section class="mx-auto mt-6 max-w-4xl px-4">
      <div v-if="filteredResearches.length" class="space-y-6">
        <article
          v-for="item in filteredResearches"
          :key="item.id"
          class="rounded border bg-white p-4 shadow transition hover:shadow-md"
        >
          <!-- Title -->
          <NuxtLink :to="`/research/${item.id}`" class="block">
            <h2 class="text-lg font-semibold text-maroon hover:underline">
              {{ item.title }}
            </h2>
          </NuxtLink>

          <!-- Meta -->
          <div class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600">
            <span>{{ formatDate(item.date) }}</span>

            <template v-if="departmentName(item.departmentId)">
              <span class="text-gray-400">•</span>
              <span>Dept: {{ departmentName(item.departmentId) }}</span>
            </template>

            <template v-if="item.researchers">
              <span class="text-gray-400">•</span>
              <span>Researchers: {{ item.researchers }}</span>
            </template>
          </div>

          <!-- Cover -->
          <NuxtLink :to="`/research/${item.id}`" class="block">
  <img
    v-if="item.coverImages?.length"
    :src="item.coverImages[0]"
    alt="Cover"
    class="mt-3 w-full max-h-96 rounded object-contain bg-white"
    loading="lazy"
  />
</NuxtLink>


          <!-- Description -->
          <p class="mt-3 text-sm text-gray-700">
            {{ item.description }}
          </p>

          <!-- Read more -->
          <div class="mt-4">
            <NuxtLink
              :to="`/research/${item.id}`"
              class="inline-flex items-center rounded border border-maroon px-3 py-1 text-sm text-maroon hover:bg-maroon hover:text-white"
            >
              Read more…
            </NuxtLink>
          </div>
        </article>
      </div>

      <div v-else class="rounded border bg-white p-8 text-center text-gray-500">
        No research found for the selected filter(s).
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'custom' })

import ChevronDown from '@/components/Icons/ChevronDown.vue'
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { collection, getDocs, orderBy, query, QueryDocumentSnapshot } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { useFirestore } from 'vuefire'

const db = useFirestore()

/* Data */
const researches = ref<any[]>([])
const departments = ref<{ id: string; name: string }[]>([])
const deptNameMap = ref<Record<string, string>>({})

/* Filters */
const showDepartments = ref(false)
const showYears = ref(false)
const selectedDeptId = ref<string>('')  // '' = All
const selectedYear = ref<string>('')    // '' = All

/* Labels */
const selectedDeptLabel = computed(() => {
  if (!selectedDeptId.value) return 'Department'
  return deptNameMap.value[selectedDeptId.value] || 'Department'
})
const selectedYearLabel = computed(() => (selectedYear.value ? selectedYear.value : 'Year'))

/* Years derived from data */
const years = computed<number[]>(() => {
  const set = new Set<number>()
  for (const r of researches.value) {
    if (r.date) {
      const y = new Date(r.date).getFullYear()
      if (!isNaN(y)) set.add(y)
    }
  }
  return Array.from(set).sort((a, b) => b - a)
})

/* Filtering */
const filteredResearches = computed(() => {
  return researches.value.filter((r) => {
    const y = r.date ? new Date(r.date).getFullYear() : null
    const matchYear = !selectedYear.value || y === parseInt(selectedYear.value)
    const matchDept = !selectedDeptId.value || r.departmentId === selectedDeptId.value
    return matchYear && matchDept
  })
})

/* Utils */
function departmentName(id?: string) {
  return (id && deptNameMap.value[id]) || ''
}
function formatDate(iso?: string): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/* Load data */
onMounted(async () => {
  const rSnap = await getDocs(query(collection(db, 'researches'), orderBy('date', 'desc')))
  researches.value = rSnap.docs.map((d: QueryDocumentSnapshot<DocumentData>) => ({
    id: d.id,
    ...d.data(),
  }))

  const dSnap = await getDocs(collection(db, 'departments'))
  const map: Record<string, string> = {}
  departments.value = dSnap.docs.map((d) => {
    const data: any = d.data()
    const name = data?.name ?? data?.departmentName ?? data?.title ?? 'Unnamed Department'
    map[d.id] = name
    return { id: d.id, name }
  })
  deptNameMap.value = map

  window.addEventListener('click', closeDropdowns)
})
onUnmounted(() => {
  window.removeEventListener('click', closeDropdowns)
})

function closeDropdowns() {
  showDepartments.value = false
  showYears.value = false
}

/* UI */
function toggleDepartments() {
  showDepartments.value = !showDepartments.value
  showYears.value = false
}
function toggleYear() {
  showYears.value = !showYears.value
  showDepartments.value = false
}
function selectDepartment(id: string) {
  selectedDeptId.value = id
  showDepartments.value = false
}
function selectYear(year: string) {
  selectedYear.value = year
  showYears.value = false
}
</script>

<style scoped>
.text-maroon { color: #740505; }
.bg-maroon { background-color: #740505; }
.border-maroon { border-color: #740505; }
</style>
