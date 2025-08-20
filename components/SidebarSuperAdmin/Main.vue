<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="h-full w-64 bg-maroon text-white">
      <div class="p-4">
        <h2 class="mb-4 text-lg font-bold">Admin Dashboard</h2>
        <nav>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/admin/super-admin/"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/admission"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Admission
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/create-account"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Create Account
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/news"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Manage News
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_accounts"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Manage Accounts
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_about"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Manage About
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/research"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Manage Researches
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/faculty_staff"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Faculty and Staff
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_gallery"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Manage Gallery
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/events"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Manage Events
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                to="/admin/super-admin/downloads"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Manage Downloads
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                to="/admin/super-admin/manage_department"
                class="block rounded px-3 py-2 transition duration-300 hover:text-yellow-400"
              >
                Departments
              </NuxtLink>
            </li>
            <li>
              <button
                @click="logout"
                class="block w-full rounded px-3 py-2 text-left transition duration-300 hover:text-yellow-400"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto p-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
  import { signOut } from "firebase/auth";
  import { useRouter } from "vue-router";
  import { useFirebaseAuth } from "vuefire";

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
