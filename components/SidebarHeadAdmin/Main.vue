<template>
  <aside class="fixed w-64 h-full text-white bg-maroon">
    <div class="p-4">
      <h2 class="mb-4 text-lg font-bold">Department Head</h2>
      <nav>
        <ul class="space-y-2">
          <li>
            <NuxtLink
              to="/admin/head-admin/"
              class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              :class="['block px-3 py-2 ', isActive('/admin/head-admin/') ? 'active' : '']"
              >
            <!--this is the index.vue-->
              Profile
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/admin/head-admin/faculty-staff"
              class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              :class="['block px-3 py-2 ', isActive('/admin/head-admin/faculty-staff') ? 'active' : '']"
            >
              Faculty and Staff
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/admin/head-admin/degree-program"
              class="block px-3 py-2 transition duration-300 rounded hover:text-yellow-400"
              :class="['block px-3 py-2 ', isActive('/admin/head-admin/degree-program') ? 'active' : '']"
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
const route = useRoute(); // Use the current route object

const isActive = (path) => {
if (path === '/admin/head-admin/') {
  // Check if we're at the root admin path or exact match
  return route.path === '/admin/head-admin/' || route.path === '/admin/head-admin';
}
return route.path === path;
};
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
.active {
background-color: white; /* Optional background color */
color: #ffd700; /* Highlight the active tab with yellow color */
font-weight: bold; /* Make it stand out */
border-left: 4px solid #ffd700; /* Add a left border for visual effect */
}
</style>
