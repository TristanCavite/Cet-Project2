<template>
  <header>
    <nav
      class="scrolled fixed z-50 flex w-full flex-col items-center border-b-2 border-red-800 bg-gradient-to-b from-white via-red-100 to-red-200 py-0 text-red-800"
    >
      <!-- Header Bar with Search and Social Icons -->
      <div class="mb-2 flex w-full items-center justify-between bg-red-800 px-2">
        <!-- Left: Social Icons -->
        <div class="flex items-center space-x-4">
          <a
            href="https://www.facebook.com/vsuengineering"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook class="h-5 w-5 text-white hover:text-red-600" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram class="h-5 w-5 text-white hover:text-red-600" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter class="h-5 w-5 text-white hover:text-red-600" />
          </a>
        </div>

        <!-- Right: Search Bar -->
        <div class="relative my-2 w-60">
          <input
            id="search"
            type="text"
            placeholder="Search"
            class="h-10 w-full rounded-full bg-red-800 pl-10 font-montserrat text-sm text-white placeholder-white focus:outline-none"
          />
          <span class="absolute inset-y-0 left-3 flex items-center text-white">
            <!-- Replace this with your search icon component if needed -->
            <IconsSearch />
          </span>
        </div>
      </div>
      <!-- Logo (Center) -->
      <NuxtLink to="/" class="my-2 flex items-center justify-center gap-3">
        <img src="/logo.png" alt="College of Engineering and Technology Logo" class="h-12 w-72" />
      </NuxtLink>

      <!-- Login/Logout and Tabs (Bottom Section) -->
      <div class="w-full">
        <!-- Background full-width but content centered inside -->
        <!-- Force background to span full width -->
        <div class="w-full border border-white/10 bg-black/70 shadow-lg backdrop-blur-md">
          <div class="mx-auto w-full max-w-screen-xl px-4">
            <Tabs default-value="home">
              <TabsList
                class="flex cursor-pointer items-center justify-center gap-12 font-montserrat text-lg text-white"
              >
                <!-- Home -->
                <NuxtLink
                  to="/"
                  class="border-b-2 border-transparent pb-0 font-montserrat font-semibold text-white hover:border-yellow-500 hover:text-yellow-500"
                >
                  Home
                </NuxtLink>

                <!-- About Dropdown -->
                <div class="group relative">
                  <TabsTrigger
                    value="about"
                    class="flex items-center gap-1 border-b-2 border-transparent pb-0 font-montserrat font-semibold text-white group-hover:border-yellow-500 group-hover:text-yellow-500"
                  >
                    About
                    <ChevronDown class="h-4 w-4 text-white group-hover:text-yellow-500" />
                  </TabsTrigger>

                  <div
                    class="absolute z-50 mt-1 hidden w-80 bg-[#342E2E] text-white shadow-lg group-hover:block"
                  >
                    <NuxtLink
                      to="/about/college"
                      class="block border-b border-gray-500 px-4 py-2 hover:bg-gray-700"
                    >
                      The College
                    </NuxtLink>

                    <NuxtLink
                      to="/about/facilities"
                      class="block border-b border-gray-500 px-4 py-2 hover:bg-gray-700"
                    >
                      Facilities
                    </NuxtLink>

                    <!-- 🏢 Offices and Administration with dynamic departments -->
                    <div class="group/admin relative border-b border-gray-500 hover:bg-gray-700">
                      <div class="flex cursor-pointer justify-between px-4 py-2">
                        <NuxtLink to="/about/administration" class="flex w-full justify-between">
                          Offices and Administration <span class="text-yellow-500">▶</span>
                        </NuxtLink>
                      </div>

                      <!-- 2nd level submenu: departments -->
                      <div
                        class="absolute left-full top-0 z-30 hidden w-[320px] bg-[#342E2E] text-white shadow-lg group-hover/admin:block"
                      >
                        <NuxtLink
                          v-for="dept in departments"
                          :key="dept.id"
                          :to="`/about/dept_personels/${dept.id}`"
                          class="block border-b border-gray-500 px-4 py-2 hover:bg-gray-700"
                        >
                          {{ dept.name }}
                        </NuxtLink>
                      </div>
                    </div>

                    <NuxtLink to="/about/map" class="block px-4 py-2 hover:bg-gray-700">
                      Map and Location
                    </NuxtLink>
                  </div>
                </div>

                <!-- ✅ Academics Dropdown -->
                <div class="group relative">
                  <TabsTrigger
                    value="academics"
                    class="flex items-center gap-1 border-b-2 border-transparent font-montserrat font-semibold text-white group-hover:border-yellow-500 group-hover:text-yellow-500"
                  >
                    Academics
                    <ChevronDown class="h-4 w-4 text-white group-hover:text-yellow-500" />
                  </TabsTrigger>

                  <!-- First-Level Dropdown -->
                  <div
                    class="absolute z-50 hidden min-w-[260px] bg-[#342E2E] text-white shadow-lg group-hover:block"
                  >
                    <div class="flex flex-col">
                      <!-- 📁 Degree Program Dropdown -->
                      <div
                        class="group/degree relative cursor-pointer border-b border-gray-500 px-4 py-2 hover:bg-gray-700"
                      >
                        <div class="flex items-center justify-between">
                          <span>Degree Program</span>
                          <span class="text-yellow-500">▶</span>
                        </div>

                        <!-- Departments (Second-Level Dropdown) -->
                        <div
                          class="absolute left-full top-0 z-50 hidden w-[300px] flex-col bg-[#342E2E] shadow-lg group-hover/degree:flex"
                        >
                          <NuxtLink
                            v-for="dept in departments"
                            :key="dept.id"
                            :to="`/academics/departments/${dept.id}`"
                            class="border-b border-gray-500 px-4 py-2 hover:bg-gray-700"
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
                <div class="group relative">
                  <TabsTrigger
                    value="admission"
                    class="flex items-center gap-1 border-b-2 border-transparent pb-0 font-montserrat font-semibold text-white group-hover:border-yellow-500 group-hover:text-yellow-500"
                  >
                    Admission
                    <ChevronDown class="h-4 w-4 text-white group-hover:text-yellow-500" />
                  </TabsTrigger>
                  <div
                    class="absolute z-50 mt-1 hidden w-56 bg-[#342E2E] text-white shadow-lg group-hover:block"
                  >
                    <NuxtLink
                      to="/admission/why_choose_cet"
                      class="block border-b border-gray-500 px-4 py-2 hover:bg-gray-700"
                    >
                      Why choose VSU?
                    </NuxtLink>
                    <NuxtLink
                      to="/admission/undergraduate"
                      class="block border-b border-gray-500 px-4 py-2 hover:bg-gray-700"
                    >
                      Undergraduate
                    </NuxtLink>
                    <NuxtLink to="/admission/graduate" class="block px-4 py-2 hover:bg-gray-700">
                      Graduate
                    </NuxtLink>
                  </div>
                </div>

                <!-- Research -->
                <NuxtLink
                  to="/research/"
                  class="border-b-2 border-transparent pb-0 font-semibold hover:border-yellow-500 hover:text-yellow-500"
                >
                  Research
                </NuxtLink>

                <!-- News -->
                <NuxtLink
                  to="/news/"
                  class="border-b-2 border-transparent pb-0 font-semibold hover:border-yellow-500 hover:text-yellow-500"
                >
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
  import ChevronDown from "@/components/Icons/ChevronDown.vue";
  import IconsSearch from "@/components/Icons/Search.vue";
  import { signOut } from "firebase/auth";
  import { collection, getDocs } from "firebase/firestore";
  import { Facebook, Instagram, Twitter } from "lucide-vue-next";
  import { onMounted, ref } from "vue";
  import { useFirestore } from "vuefire";

  // Auth
  const user = useCurrentUser();
  const auth = useFirebaseAuth();
  const departmentRefs = ref<HTMLElement[]>([]);
  const programDirections = ref<Record<number, "left" | "right">>({});

  const db = useFirestore();

  const departments = ref<any[]>([]);

  const logout = async () => {
    if (auth) {
      await signOut(auth);
      navigateTo("/");
    }
  };
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

  function getDropdownDirection(triggerEl: HTMLElement): "left" | "right" {
    const { right } = triggerEl.getBoundingClientRect();
    const spaceRight = window.innerWidth - right;
    return spaceRight < 320 ? "left" : "right";
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
