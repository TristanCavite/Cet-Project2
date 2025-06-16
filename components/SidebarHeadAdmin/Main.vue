<template>
    <aside class="w-64 h-full text-white bg-maroon">
      <div class="p-4">
        <h2 class="mb-4 text-lg font-bold">Department Head</h2>
        <nav>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/admin/head-admin/"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
              <!--this is the index.vue-->
                Profile
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/head-admin/faculty-staff"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Faculty and Staff
              </NuxtLink>
            </li>

                  <!-- ✅ NEW Department Page -->
          <li>
            <NuxtLink
              to="/admin/head-admin/department-page"
              class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
            >
              Department Page
            </NuxtLink>
          </li>
            <li>
              <NuxtLink
                to="/admin/head-admin/degree-program"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Degree Program
              </NuxtLink>
            </li>
            <li>
              <button
                @click="logout"
                class="block w-full px-3 py-2 text-left transition duration-300 rounded hover:text-yellow-400"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  </template>
  
  <script setup>
  import { useFirebaseAuth } from "vuefire";
  import { signOut } from "firebase/auth";
  import { useRouter } from "vue-router";
  
  const auth = useFirebaseAuth();
  const router = useRouter();
  
  const logout = async () => {
    if (auth) {
      await signOut(auth);
      router.push("/login");
    }
  };
  </script>
  
  <style scoped>
  .bg-maroon {
    background-color: #740505;
  }
  .hover\:text-yellow-400:hover {
    color: #ffd700;
  }
  </style>
  