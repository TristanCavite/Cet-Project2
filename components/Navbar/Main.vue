
<template>
    <header>
      <nav class="fixed z-50 flex flex-col justify-between w-full px-16 py-2 text-red-800 bg-white border-b-2 border-red-800 scrolled">
        <!-- Top Row with Logo and Search Bar -->
        <div class="flex flex-row items-center justify-between w-full py-2">
          <NuxtLink to="/" class="flex items-center gap-3">
            <img src="/logo.png" alt="College of Engineering and Technology Logo" class="h-12 w-72" />
          </NuxtLink>
  
          <!-- Search Bar -->
          <div class="relative w-60">
            <Input
              id="search"
              type="text"
              placeholder="Search"
              class="h-10 pl-10 text-sm text-white placeholder-white bg-red-800 rounded-full font-montserrat focus:outline-none"
              />
  
            <span class="absolute inset-y-0 flex items-center text-white left-3">
              <IconsSearch />
            </span>
          </div>
        </div>
  
         <!-- Tabs with Login/Logout on the Far Left -->
         <div class="flex items-center w-full">
          <!-- Login Admin Link or Logout Button on the Far Left -->
          <div class="mr-auto">
            <NuxtLink v-if="!user" to="/login">
              <TabsTrigger
              value="Login"
                class="pb-0 text-xs text-red-800 border-b-2 border-transparent font-montserrat hover:text-yellow-500"
              >
                Login Admin
              </TabsTrigger>
            </NuxtLink>
            <button v-else @click="logout" class="text-xs text-red-800 font-montserrat hover:text-yellow-500">
              Logout
            </button>
          </div>
  
          <!-- Centered Tabs -->
          <div class="flex justify-center flex-1 text-lg text-red-800 font-montserrat">
            <Tabs default-value="home">
              <TabsList class="flex items-center gap-12 cursor-pointer">
                <!-- Home -->
                <NuxtLink
                  to="/"
                  class="pb-0 font-semibold text-red-800 border-b-2 border-transparent font-montserrat hover:border-yellow-500 hover:text-yellow-500"
                >
                  Home
                </NuxtLink>
                <!-- About Dropdown -->
                <div class="relative group">
                  <TabsTrigger
                    value="about"
                    class="flex items-center gap-1 pb-0 font-semibold text-red-800 border-b-2 border-transparent font-montserrat hover:border-yellow-500 hover:text-yellow-500"
                  >
                    About
                    <ChevronDown class="w-4 h-4 text-red-800" />
                  </TabsTrigger>
  
                  <!-- drop down menu for about navbar -->
                  <div class="absolute mt-1 hidden w-80 bg-[#342E2E] text-white shadow-lg group-hover:block">
                    <NuxtLink
                      to="/about/college"
                      class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                    >
                      The College
                    </NuxtLink>
  
                    <NuxtLink
                      to="/about/facilities"
                      class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                    >
                      Facilities
                    </NuxtLink>
  
                    <!-- submenu container -->
                    <div class="relative z-20 border-b border-gray-500 hover:bg-gray-700" id="departmentPersonel">
                      <!-- container for offices and administration -->
                      <div class="">
                        <NuxtLink
                          to="/about/administration"
                          class="flex justify-between px-4 py-2">
                          Offices and Administration
                          <span class="text-yellow-500">▶</span>
                        </NuxtLink>
                      </div>
  
                      <!-- sub  menu-->
                      <div id="degreeProgramMenu"
                        class="absolute left-full top-0 mb-10 w-100 bg-[#342E2E] text-white shadow-lg hidden z-30">
                        <NuxtLink
                          to="/about/dept_personels/ABS"
                          class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                        >
                          Agricultural and Biosystem Engineering
                        </NuxtLink>
                        
                        <NuxtLink
                          to="/about/dept_personels/CE"
                          class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                        >
                          Civil Engineering
                        </NuxtLink>
  
                        <NuxtLink
                          to="/about/dept_personels/CS"
                          class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                        >
                          Computer Science
                        </NuxtLink>
  
                        <NuxtLink
                          to="/about/dept_personels/GE"
                          class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                        >
                          Geodetic Engineering
                        </NuxtLink>
  
                        <NuxtLink
                          to="/about/dept_personels/ME"
                          class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700"
                        >
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
                <!-- Admission Dropdown -->
                <div class="relative group">
                  <TabsTrigger
                    value="admission"
                    class="flex items-center gap-1 pb-0 font-semibold text-red-800 border-b-2 border-transparent font-montserrat hover:border-yellow-500 hover:text-yellow-500"
                  >
                    Admission
                    <ChevronDown class="w-4 h-4 text-red-800" />
                  </TabsTrigger>
                  <div
                    class="absolute mt-1 hidden w-56 bg-[#342E2E] text-white shadow-lg group-hover:block"
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
                <!-- Academics Dropdown -->
                <div class="relative group">
                  <TabsTrigger
                    value="academics"
                    class="flex items-center gap-1 font-semibold text-red-800 border-b-2 border-transparent font-montserrat hover:border-yellow-500 hover:text-yellow-500"
                  >
                    Academics
                    <ChevronDown class="w-4 h-4 text-red-800" />
                  </TabsTrigger>
  
                  <div class="absolute hidden w-56 bg-[#342E2E] text-white shadow-lg group-hover:block cursor-pointer">
                    <NuxtLink to="/academics/degree_program" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
                      Degree Program
                    </NuxtLink>
  
                    <NuxtLink to="/academics/academic_calendar" class="block px-4 py-2 border-b border-gray-500 hover:bg-gray-700">
                      Academic Calendar
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
              </TabsList>
            </Tabs>
          </div>
        </div>
      </nav>
    </header>
  </template>
  
  <script setup lang="ts">
    import ChevronDown from "@/components/Icons/ChevronDown.vue";
    import IconsSearch from "@/components/Icons/Search.vue";
    import { signOut } from "firebase/auth";
    import { onMounted } from 'vue';
  
    
    // Get current user and Firebase auth instance
    const user = useCurrentUser();
    const auth = useFirebaseAuth();
    
    // Logout function
    const logout = async () => {
      if (auth) {
        await signOut(auth);
        navigateTo("/"); // Redirect to home after logout
      }
    };
    
    let degreeProgramTrigger: HTMLElement | null;
    let degreeProgramMenu: HTMLElement | null;
    onMounted(() => 
    {
      // Initialize DOM elements with proper TypeScript type assertions
      degreeProgramTrigger = document.querySelector('#departmentPersonel') as HTMLElement;
      degreeProgramMenu = document.querySelector('#degreeProgramMenu') as HTMLElement;
  
      if (degreeProgramTrigger && degreeProgramMenu) {
        // Show submenu on hover
        degreeProgramTrigger.addEventListener('mouseover', () => {
          degreeProgramMenu?.classList.remove('hidden');
        });
        
        // Hide submenu on mouseout
        degreeProgramTrigger.addEventListener('mouseout', () => {
          degreeProgramMenu?.classList.add('hidden');
        });
  
        // Keep submenu open if hovered
        degreeProgramMenu.addEventListener('mouseover', () => {
          degreeProgramMenu?.classList.remove('hidden');
        });
        
        // Hide submenu when mouse leaves
        degreeProgramMenu.addEventListener('mouseout', () => {
          degreeProgramMenu?.classList.add('hidden');
        });
      }
    });
    const handleMouseOver = (event: MouseEvent): void => {
      if (degreeProgramMenu) {
        degreeProgramMenu.classList.remove('hidden');
      }
    };
  
    // Mouse Out Handler
    const handleMouseOut = (event: MouseEvent): void => {
      if (degreeProgramMenu) {
        degreeProgramMenu.classList.add('hidden');
      }
    };
  
    const activeTab = ref('')
  
    const switchTab = (tab: string) => {
      activeTab.value = tab
    }
  </script>
  <style>
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
  