<template>
  <header>
    <nav class="fixed z-50 flex flex-col items-center w-full py-0 text-red-800 bg-gradient-to-b from-white via-red-100 to-red-200 border-b-2 border-red-800 scrolled">

    <!-- Header Bar with Search and Social Icons -->
  <div class="flex items-center justify-between w-full bg-red-800 mb-2 px-2">
    <!-- Left: Social Icons -->
    <div class="flex items-center space-x-4">
      <a href="https://www.facebook.com/vsuengineering" target="_blank" rel="noopener noreferrer">
        <Facebook class="w-5 h-5 text-white hover:text-red-600" />
      </a>
      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
        <Instagram class="w-5 h-5 text-white hover:text-red-600" />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
        <Twitter class="w-5 h-5 text-white hover:text-red-600" />
      </a>
    </div>

    <!-- Right: Search Bar -->
    <div class="relative w-60 my-2">
      <input
        id="search"
        type="text"
        placeholder="Search"
        class="w-full h-10 pl-10 text-sm text-white placeholder-white bg-red-800 rounded-full font-montserrat focus:outline-none"
      />
      <span class="absolute inset-y-0 left-3 flex items-center text-white">
        <!-- Replace this with your search icon component if needed -->
        <IconsSearch />
      </span>
    </div>
  </div>
      <!-- Logo (Center) -->
      <NuxtLink to="/" class="flex justify-center items-center gap-3 my-2">
        <img src="/logo.png" alt="College of Engineering and Technology Logo" class="h-12 w-72" />
      </NuxtLink>

      <!-- Login/Logout and Tabs (Bottom Section) -->
<div class="w-full">
  <!-- Background full-width but content centered inside -->
  <!-- Force background to span full width -->
<div class="w-full bg-black/70 backdrop-blur-md border border-white/10 shadow-lg">
  <div class="max-w-screen-xl w-full mx-auto px-4">
    <Tabs default-value="home">
      <TabsList class="flex items-center justify-center gap-12 text-lg text-white font-montserrat cursor-pointer">
        <!-- Home -->
        <NuxtLink
          to="/"
          class="pb-0 font-semibold text-white border-b-2 border-transparent font-montserrat hover:border-red-800 hover:text-red-800"
        >
          Home
        </NuxtLink>

        <!-- About Dropdown -->
        <div class="relative group">
          <TabsTrigger
            value="about"
            class="flex items-center gap-1 pb-0 font-semibold text-white border-b-2 border-transparent font-montserrat group-hover:text-red-800 group-hover:border-red-800"
          >
            About
            <ChevronDown class="w-4 h-4 text-white group-hover:text-red-800" />
          </TabsTrigger>

          <div class="absolute mt-1 hidden w-80 bg-[#342E2E] text-white shadow-lg group-hover:block z-50">
            <NuxtLink to="/about/college" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
              The College
            </NuxtLink>
            <NuxtLink to="/about/facilities" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
              Facilities
            </NuxtLink>

            <div class="relative z-20 border-b border-gray-500 hover:bg-gray-700">
              <NuxtLink to="/about/administration" class="flex justify-between px-4 py-2">
                Offices and Administration <span class="text-yellow-500">▶</span>
              </NuxtLink>

              <div class="absolute left-full top-0 w-100 bg-[#342E2E] text-white shadow-lg hidden z-30">
                <NuxtLink to="/about/dept_personels/ABS" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
                  Agricultural and Biosystem Engineering
                </NuxtLink>
                <NuxtLink to="/about/dept_personels/CE" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
                  Civil Engineering
                </NuxtLink>
                <NuxtLink to="/about/dept_personels/CS" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
                  Computer Science
                </NuxtLink>
                <NuxtLink to="/about/dept_personels/GE" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
                  Geodetic Engineering
                </NuxtLink>
                <NuxtLink to="/about/dept_personels/ME" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
                  Mechanical Engineering
                </NuxtLink>
                <NuxtLink to="/about/dept_personels/Met" class="block px-4 py-2 hover:bg-gray-700">
                  Meteorology
                </NuxtLink>
              </div>
            </div>

            <NuxtLink to="/about/map" class="block px-4 py-2 hover:bg-gray-700">
              Map and Location
            </NuxtLink>
          </div>
        </div>

   <!-- ✅ Academics Dropdown -->
<div class="relative group">
  <TabsTrigger
    value="academics"
    class="flex items-center gap-1 font-semibold text-white border-b-2 border-transparent font-montserrat hover:border-red-800 hover:text-red-800"
  >
    Academics
    <ChevronDown class="w-4 h-4 text-white group-hover:text-red-800" />
  </TabsTrigger>

  <!-- First-Level Dropdown -->
  <div class="absolute hidden group-hover:block bg-[#342E2E] text-white shadow-lg z-50 min-w-[260px]">
    <div class="flex flex-col">

      <!-- 📁 Degree Program Dropdown -->
      <div class="relative group/degree border-b border-gray-500 hover:bg-gray-700 px-4 py-2 cursor-pointer">
        <div class="flex justify-between items-center">
          <span>Degree Program</span>
          <span class="text-yellow-500">▶</span>
        </div>

        <!-- Departments (Second-Level Dropdown) -->
        <div class="absolute top-0 left-full hidden group-hover/degree:flex flex-col bg-[#342E2E] w-[300px] shadow-lg z-50">
          <NuxtLink
            v-for="dept in departments"
            :key="dept.id"
            :to="`/academics/departments/${dept.id}`"
            class="px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
          >
            {{ dept.name }}
          </NuxtLink>
        </div>
      </div>

      <!-- 📅 Academic Calendar -->
      <NuxtLink
        to="/academics/academic_calendar"
        class="block px-4 py-2 hover:bg-gray-700"
      >
        Academic Calendar
      </NuxtLink>
    </div>
  </div>
</div>



<!-- Admission Dropdown -->
        <div class="relative group">
          <TabsTrigger
            value="admission"
            class="flex items-center gap-1 pb-0 font-semibold text-white border-b-2 border-transparent font-montserrat group-hover:border-red-800 group-hover:text-red-800"
          >
            Admission
            <ChevronDown class="w-4 h-4 text-white group-hover:text-red-800" />
          </TabsTrigger>
          <div class="absolute mt-1 hidden w-56 bg-[#342E2E] text-white shadow-lg group-hover:block z-50">
            <NuxtLink to="/admission/why_choose_cet" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
              Why choose VSU?
            </NuxtLink>
            <NuxtLink to="/admission/undergraduate" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
              Undergraduate
            </NuxtLink>
            <NuxtLink to="/admission/graduate" class="block px-4 py-2 hover:bg-gray-700">
              Graduate
            </NuxtLink>
          </div>
        </div>



        <!-- Research -->
        <NuxtLink to="/research/" class="pb-0 font-semibold border-b-2 border-transparent hover:border-yellow-500 hover:text-yellow-500">
          Research
        </NuxtLink>

        <!-- News -->
        <NuxtLink to="/news/" class="pb-0 font-semibold border-b-2 border-transparent hover:border-yellow-500 hover:text-yellow-500">
          News
        </NuxtLink>
      </TabsList>
    </Tabs>
    </div>
  </div>
</div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { Facebook, Instagram, Twitter } from 'lucide-vue-next';
import ChevronDown from "@/components/Icons/ChevronDown.vue";
import IconsSearch from "@/components/Icons/Search.vue";
import { signOut } from "firebase/auth";
import { onMounted, ref } from 'vue';
import { collection, getDocs } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
// Auth
const user = useCurrentUser();
const auth = useFirebaseAuth();
const departmentRefs = ref<HTMLElement[]>([]);
const programDirections = ref<Record<number, 'left' | 'right'>>({});

const db = useFirestore()

const departments = ref<any[]>([])

const logout = async () => {
  if (auth) {
    await signOut(auth);
    navigateTo("/");
  }
};
onMounted(async () => {
  try {
    const snapshot = await getDocs(collection(db, 'departments'));
    departments.value = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name || 'Unnamed Dept',
    }));
  } catch (err) {
    console.error('🔥 Failed to load departments:', err);
  }
});

function getDropdownDirection(triggerEl: HTMLElement): 'left' | 'right' {
  const { right } = triggerEl.getBoundingClientRect();
  const spaceRight = window.innerWidth - right;
  return spaceRight < 320 ? 'left' : 'right';
}
function setProgramDirection(index: number) {
  const triggerEl = departmentRefs.value[index];
  if (triggerEl) {
    programDirections.value[index] = getDropdownDirection(triggerEl);
  }
}


</script>

<style scoped>
#search::placeholder {
  color: white;
  opacity: 1;
  font-size: 0.8rem;
  font-family: "Montserrat", sans-serif;
}

#search:focus {
  outline: none;
  box-shadow: none;
}

.hover\:border-yellow-500:hover {
  border-bottom-color: #ffd700;
}

.hover\:text-yellow-500:hover {
  color: #ffd700;
} 

.absolute {
  margin: 0;
}
</style>