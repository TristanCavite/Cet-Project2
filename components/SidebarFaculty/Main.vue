<template>
    <aside class="w-64 bg-maroon text-white fixed h-full">
      <div class="p-4">
        <h2 class="text-lg font-bold mb-4">Faculty</h2>
        <nav>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/admin/faculty/" 
                class="block py-2 px-3 rounded hover:text-yellow-400 transition duration-300"
              > <!--this is the index.vue-->
                Profile
              </NuxtLink>
            </li>
            <li>
              <button
                @click="logout"
                class="block w-full text-left py-2 px-3 rounded hover:text-yellow-400 transition duration-300"
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
  