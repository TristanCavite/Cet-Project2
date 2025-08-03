<template>
  <div class="py-10 bg-stone-200">
    <div class="max-w-6xl px-4 mx-auto">
      <!-- Department Page Box -->
      <div class="overflow-hidden rounded shadow bg-neutral-50">
        <!-- Cover Image -->
        <div v-if="departmentPage?.coverImageUrl">
          <img
            :src="departmentPage.coverImageUrl"
            alt="Department cover"
            class="w-full h-44 md:h-[400px] object-cover"
          />
        </div>

        <!-- Content -->
        <div v-if="departmentPage?.content" class="px-6 py-8 prose max-w-none" v-html="departmentPage.content" />
      </div>

      <!-- Degree Programs -->
      <div v-if="degreePrograms.length" class="p-6 mt-10 space-y-4 rounded shadow bg-neutral-50">
        <h2 class="text-2xl font-bold text-maroon">Degree Programs Offered</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <NuxtLink
            v-for="program in degreePrograms"
            :key="program.id"
            :to="`/academics/degree-programs/${departmentId}/${program.id}`"
            class="block p-4 transition bg-white border rounded hover:shadow hover:bg-gray-50"
          >
            <h3 class="text-lg font-semibold text-maroon">{{ program.name }}</h3>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useFirestore } from 'vuefire'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { ref, onMounted } from 'vue'
definePageMeta({ layout: 'custom' })
const db = useFirestore()
const route = useRoute()
const departmentId = route.params.id as string

const departmentPage = ref<{ coverImageUrl?: string; content?: string } | null>(null)
const degreePrograms = ref<{ id: string; name: string }[]>([])

onMounted(async () => {
  // Get department page content from department_pages/{departmentId}
  const pageDoc = await getDoc(doc(db, 'department_pages', departmentId))
  if (pageDoc.exists()) {
    departmentPage.value = pageDoc.data()
  }

  // Get list of degree programs under departments/{departmentId}/degreePrograms
  const programSnap = await getDocs(collection(db, 'departments', departmentId, 'degreePrograms'))
  degreePrograms.value = programSnap.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }))
})
</script>

<style scoped>
.text-maroon {
  color: #740505;
}
</style>
