<template>
  <header class="fixed z-50 w-full" :style="hideNav ? 'height: 120px;' : 'height: 30px;'">
    <!-- Header Bar with Search and Social Icons -->
    <transition name="header-sticky">
      <div class="bg-white border-gray-200 header-bar-transition">
        <div class="flex items-center justify-center w-full gap-64 md:px-4">
          <!-- Left: Social Icons -->
         <!-- Left: Social Icons -->
<div class="flex items-center space-x-6">
  <a
    v-for="it in socialItems"
    :key="it.key"
    :href="it.href"
    target="_blank"
    rel="noopener noreferrer"
    class="text-red-900 transition-opacity hover:opacity-80"
    :title="it.key"
    :aria-label="it.key"
  >
    <component
      :is="SOCIAL_ICONS[it.key] || Globe"
      class="text-red-900 size-5 fill-neutral-100 md:size-6"
    />
  </a>
</div>


          <!-- Logo (Center) -->
          <NuxtLink to="/" class="">
            <HeaderMain />
          </NuxtLink>

          <!-- Right: Search Bar -->
          <div class="relative my-1 w-38">
            <UiInput
              id="search"
              type="text"
              v-model="searchQuery"
              @keydown.enter="submitSearch"
              placeholder="Search"
              class="w-full h-10 pl-10 text-sm border-2 border-red-900 rounded-full bg-neutral-100 font-montserrat placeholder:text-black focus:outline-black focus:ring-0"
            />

            <span class="absolute inset-y-0 flex items-center text-white left-3">
              <!-- Replace this with your search icon component if needed -->
              <IconsSearch class="text-red-900 fill-white" />
            </span>
          </div>
        </div>
      </div>
    </transition>

    <!-- Navigation Bar -->
    <transition name="nav-fade-up">
      <nav
        v-if="!hideNav"
        class="flex flex-col items-center w-full bg-red-900"
        :class="['flex w-full flex-col items-center', { 'nav-fixed': !hideNav }]"
      >
        <!-- Login/Logout and Tabs (Bottom Section) -->
        <div class="w-full">
          <!-- Background full-width but content centered inside -->
          <!-- Force background to span full width -->
          <div class="w-full border shadow-lg">
            <div class="w-full max-w-screen-xl py-3 mx-auto">
              <Tabs default-value="home">
                <TabsList
                  class="flex items-center justify-center gap-12 text-lg text-white cursor-pointer font-montserrat"
                >
                  <!-- Home -->
                  <NuxtLink
                    to="/"
                    class="pb-0 font-semibold text-white border-b-2 border-transparent font-montserrat hover:border-yellow-500 hover:text-yellow-500"
                  >
                    Home
                  </NuxtLink>

                  <!-- About Dropdown -->
                  <div class="relative group">
                    <TabsTrigger
                      value="about"
                      class="flex items-center gap-1 pb-0 font-semibold text-white border-b-2 border-transparent font-montserrat group-hover:border-yellow-500 group-hover:text-yellow-500"
                    >
                      About
                      <ChevronDown class="w-4 h-4 text-white group-hover:text-yellow-500" />
                    </TabsTrigger>

                    <div
                      class="absolute z-50 mt-1 hidden w-80 bg-[#342E2E] text-white shadow-lg group-hover:block"
                    >
                      <NuxtLink
                        to="/about/faculty"
                        class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                      >
                        Faculty
                      </NuxtLink>

                      <NuxtLink
                        to="/about/facilities"
                        class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                      >
                        Facilities
                      </NuxtLink>
                      <NuxtLink
                        to="/about/history"
                        class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                      >
                        History
                      </NuxtLink>

                      <!-- 🏢 Offices and Administration with dynamic departments -->
                      <div class="relative border-b border-gray-500 group/admin hover:bg-gray-700">
                        <div class="flex justify-between px-4 py-2 cursor-pointer">
                          <NuxtLink to="/about/administration" class="flex justify-between w-full">
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
                            class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
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
                  <div class="relative group">
                    <TabsTrigger
                      value="academics"
                      class="flex items-center gap-1 font-semibold text-white border-b-2 border-transparent font-montserrat group-hover:border-yellow-500 group-hover:text-yellow-500"
                    >
                      Academics
                      <ChevronDown class="w-4 h-4 text-white group-hover:text-yellow-500" />
                    </TabsTrigger>

                    <!-- First-Level Dropdown -->
                    <div
                      class="absolute z-50 hidden min-w-[260px] bg-[#342E2E] text-white shadow-lg group-hover:block"
                    >
                      <div class="flex flex-col">
                        <!-- 📁 Degree Program Dropdown -->
                        <div
                          class="relative px-4 py-2 border-b border-gray-500 cursor-pointer group/degree hover:bg-gray-700"
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
                      class="flex items-center gap-1 pb-0 font-semibold text-white border-b-2 border-transparent font-montserrat group-hover:border-yellow-500 group-hover:text-yellow-500"
                    >
                      Admission
                      <ChevronDown class="w-4 h-4 text-white group-hover:text-yellow-500" />
                    </TabsTrigger>
                    <div
                      class="absolute z-50 mt-1 hidden w-56 bg-[#342E2E] text-white shadow-lg group-hover:block"
                    >
                      <NuxtLink
                        to="/admission/why_choose_cet"
                        class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                      >
                        Why choose VSU?
                      </NuxtLink>
                      <NuxtLink
                        to="/admission/undergraduate"
                        class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
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
                    class="pb-0 font-semibold border-b-2 border-transparent hover:border-yellow-500 hover:text-yellow-500"
                  >
                    Research
                  </NuxtLink>

                  <!-- News -->
                  <NuxtLink
                    to="/news/"
                    class="pb-0 font-semibold border-b-2 border-transparent hover:border-yellow-500 hover:text-yellow-500"
                  >
                    News
                  </NuxtLink>
                  <NuxtLink
                    to="/download/"
                    class="pb-0 font-semibold border-b-2 border-transparent hover:border-yellow-500 hover:text-yellow-500"
                  >
                    Download
                  </NuxtLink>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </nav>
    </transition>
  </header>
</template>

<script setup lang="ts">
  import ChevronDown from "@/components/Icons/ChevronDown.vue";
  import IconsSearch from "@/components/Icons/Search.vue";
  import { signOut } from "firebase/auth";
  import { collection, getDocs } from "firebase/firestore";
  import { Facebook, Instagram, Twitter, Youtube, Linkedin, Globe } from "lucide-vue-next";
  import { onBeforeUnmount, onMounted, ref } from "vue";
  import { useRouter } from "vue-router";
  import { useFirestore } from "vuefire";
  import { useSocialLinks } from "@/composables/useSocialLinks";

  // Auth
  const user = useCurrentUser();
  const auth = useFirebaseAuth();
  const departmentRefs = ref<HTMLElement[]>([]);
  const programDirections = ref<Record<number, "left" | "right">>({});

  const db = useFirestore();

  const departments = ref<any[]>([]);
  const router = useRouter();
  const searchQuery = ref("");

  const SOCIAL_ICONS: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter:  Twitter,
    youtube:  Youtube,
    linkedin: Linkedin,
    website:  Globe,
  };

  const { items: socialItems } = useSocialLinks();


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

  // to hide header on scroll down
  const hideNav = ref(false);
  let lastScrollY = window.scrollY;

  function handleScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 80) {
      hideNav.value = true; // Hide when scrolling down
    } else {
      hideNav.value = false; // Show when scrolling up
    }
    lastScrollY = currentScrollY;
  }

  function submitSearch() {
    if (searchQuery.value.trim()) {
      router.push({ path: "/search", query: { q: searchQuery.value.trim() } });
    }
  }

  onMounted(() => {
    window.addEventListener("scroll", handleScroll);
  });
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });
</script>

<style scoped>
  .hover\:border-yellow-500:hover {
    border-bottom-color: #ffd700;
  }

  .hover\:text-yellow-500:hover {
    color: #ffd700;
  }

  .absolute {
    margin: 0;
  }

  /* HEADER (remains visible, no leave transition) */
  .header-sticky-enter-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }
  .header-sticky-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .header-sticky-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  /* NO leave styles — it remains */

  /* NAVBAR fade up and disappear */
  .nav-fade-up-enter-active,
  .nav-fade-up-leave-active {
    transition:
      opacity 0.4s ease,
      transform 0.4s ease;
  }
  .nav-fade-up-enter-from {
    opacity: 0;
    transform: translateY(-20px);
  }
  .nav-fade-up-enter-to {
    opacity: 1;
    transform: translateY(0);
  }
  .nav-fade-up-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  .nav-fade-up-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }

  @keyframes slideDown {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(0);
    }
  }
  @keyframes slideUp {
    from {
      transform: translateY(50px);
    }
    to {
      transform: translateY(0);
    }
  }
</style>
