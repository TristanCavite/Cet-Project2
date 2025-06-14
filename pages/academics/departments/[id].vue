<template>
  <div class="bg-gray-100 py-10">
    <div class="max-w-6xl mx-auto px-4">
      <!-- Department Page Box -->
      <div class="bg-white rounded shadow overflow-hidden">
        <!-- Cover Image -->
        <div v-if="departmentPage?.coverImageUrl">
          <img
            :src="departmentPage.coverImageUrl"
            alt="Department cover"
            class="w-full h-[400px] object-cover"
          />
        </div>

        <!-- Content -->
        <div v-if="departmentPage?.content" class="prose max-w-none px-6 py-8" v-html="departmentPage.content" />
      </div>

      <!-- Degree Programs -->
      <div v-if="degreePrograms.length" class="mt-10 bg-white p-6 rounded shadow space-y-4">
        <h2 class="text-2xl font-bold text-maroon">Degree Programs Offered</h2>
        <div class="grid md:grid-cols-2 gap-4">
          <NuxtLink
            v-for="program in degreePrograms"
            :key="program.id"
            :to="`/academics/degree-programs/${departmentId}/${program.id}`"
            class="block p-4 rounded border hover:shadow bg-white hover:bg-gray-50 transition"
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
