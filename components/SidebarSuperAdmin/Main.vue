<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 h-full text-white bg-maroon">
      <HeaderAdmin class="pt-2" />
      <div class="p-4 text-base font-semibold">
        <nav>
          <ul class="">
            <li>
              <NuxtLink
                to="/admin/super-admin/"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Home
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/admission"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Admission
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/create-account"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Create Account
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_department"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Departments
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/faculty_staff"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Faculty and Staff
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_accounts"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Manage Accounts
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_about"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Manage About
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/downloads"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Manage Downloads
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/events"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Manage Events
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/manage_gallery"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Manage Gallery
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/news"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Manage News
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/super-admin/research"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Manage Researches
              </NuxtLink>
            </li>

            <li>
              <NuxtLink
                to="/admin/super-admin/socials"
                class="block px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 hover:scale-105"
              >
                Manage Socials
              </NuxtLink>
            </li>
            <li>
              <button
                @click="logout"
                class="block w-56 px-3 py-2 transition duration-300 rounded hover:bg-yellow-400 text-start hover:scale-105"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
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
