<template>
    <aside class="fixed w-64 h-full text-white bg-maroon">
      <div class="p-4">
        <h2 class="mb-4 text-lg font-bold">Admin Dashboard</h2>
        <nav>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/admin/super-admin/"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/admission"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Admission
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/create-account"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Create Account
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_news"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Manage News
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                to="/admin/super-admin/manage_accounts"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Manage Accounts
              </NuxtLink>
            </li>


            <li>
              <NuxtLink
                to="/admin/super-admin/manage_research"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Manage Researches
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/faculty_staff"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Faculty and Staff
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_gallery"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Manage Gallery
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_event"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Manage Events
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_department"
                class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              >
                Departments
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
  