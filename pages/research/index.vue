<template>
    <main  class="pb-4 bg-stone-200">
        <div class="relative flex items-center w-full border-b-2 font-playfair">
            <img src="/images/cet.jpg" alt="Graduate Cover" class="object-cover w-full h-44 md:h-128" />
            <div class="absolute flex items-center top-28 md:top-40 left-6 md:left-[120px] h-10 w-40 md:h-28 md:w-96 bg-gray-700/90">
                <span class="pl-2 text-xl text-white md:pl-5 md:text-6xl">Research</span>
            </div>
        </div>
        <div class="flex justify-end pt-4 pr-32 space-x-4">
            <!-- year -->
             <div class="relative cursor-pointer" @click="toggleYear">
                 <TabsTrigger class="flex items-center justify-center w-16 h-6 space-x-1 text-center border-2 border-gray-900">
                     <span class="text-base text-center text-gray-700 ">Year</span>
                     <ChevronDown class="w-4 h-4 text-black" />
                 </TabsTrigger>
                 <div v-if="showYears" class="absolute top-8">
                    <ul>
                        <li v-for="year in years" :key="year" class="px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
                            {{ year }}
                        </li>
                    </ul>
                 </div>
             </div>
            <!-- departments -->
             <div class="relative cursor-pointer" @click="toggleDepartments">
                <TabsTrigger class="flex items-center justify-center h-6 space-x-1 text-center border-2 border-gray-900 w-28">
                    <span class="text-base text-center text-gray-700 ">Department</span>
                    <ChevronDown class="w-4 h-4 text-black" />
                </TabsTrigger>
                <div v-if="showDepartments" class="absolute top-8">
                    <ul>
                        <li
                            v-for="dept in departments"
                            :key="dept.id"
                            :to="`/about/dept_personels/${dept.id}`"
                            class="w-56 px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                        >
                            {{ dept.name }}
                        </li>
                    </ul>
                </div>
             </div>
        </div>
        <div>
            
        </div>
    </main>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'custom' })
import ChevronDown from "@/components/Icons/ChevronDown.vue";
import { onMounted, ref, } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useFirestore } from "vuefire";

const departmentRefs = ref<HTMLElement[]>([]);
const db = useFirestore();
const departments = ref<any[]>([]);
const showDepartments = ref(false);
const showYears = ref(false);

onMounted(async () => {
try {
    const snapshot = await getDocs(collection(db, "departments"));
    departments.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || "Unnamed Dept",
    }));
} catch (err) {
    console.error("🔥 Failed to load departments:", err);
}
});

const years = ref<number[]>([]);
onMounted(() => {
  const currentYear = new Date().getFullYear();
  years.value = Array.from({ length: 5 }, (_, i) => currentYear - i);
});

function toggleDepartments() {
    showDepartments.value = !showDepartments.value;
}
function toggleYear() {
    showYears.value = !showYears.value;
}
</script>