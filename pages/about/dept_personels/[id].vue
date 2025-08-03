<template>
  <div class="min-h-screen bg-neutral-100">
    <!-- 🔒 Left-Aligned Title Cover Image Block -->
    <div class="relative flex items-center w-full border-b-2 font-playfair">
      <img src="/CET Faculty.jpg" alt="Department Cover" class="object-cover w-full h-44 md:h-128" />
      <div class="absolute flex items-center top-28 md:top-40 left-6 md:left-[120px] h-auto w-auto md:h-auto md:w-auto bg-gray-700/90">
        <span class="p-2 text-xl text-white md:p-5 md:text-6xl">
          {{ dept?.name || "Department" }}
        </span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-6xl px-4 py-12 mx-auto">
      <!-- Head Admin -->
      <div v-if="dept?.headAdmin" class="flex flex-col items-center mb-12">
        <span class="mb-6 text-2xl font-bold text-red-900 md:text-5xl font-playfair">Department Head</span>
        <div
          @click="openProfile(dept.headAdmin, 'Head Admin')"
          class="w-full p-6 mx-auto transition bg-white rounded-lg shadow cursor-pointer hover:shadow-lg sm:w-96"
        >
          <img
            :src="dept.headAdmin.photo || '/placeholder.png'"
            alt="Head Admin"
            class="object-cover w-24 h-24 mx-auto mb-4 border-2 rounded-full border-maroon"
          />
          <h3 class="text-lg font-semibold text-center text-maroon">
            {{ dept.headAdmin.fullName || dept.headAdmin.name }}
          </h3>
          <p class="text-sm text-center text-gray-600">
            Department Head – {{ dept.name }}
          </p>
          <p class="text-sm text-center text-gray-500">
            {{ dept.headAdmin.designation || 'No designation' }}
          </p>
        </div>
      </div>

        <!-- Staff -->
      <div v-if="dept?.staff?.length" class="max-w-6xl text-center">
        <span class="text-2xl font-bold text-center text-red-900 md:text-5xl font-playfair">Faculty and Staff</span>
        <div class="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3">
          <template v-for="(staff, index) in dept.staff" :key="index">
            <div
              v-if="staff.status === 'active'"
              class="p-6 transition bg-white rounded-lg shadow cursor-pointer hover:shadow-lg"
              @click="openProfile(staff, 'Staff')"
            >
              <img
                :src="staff.photo || '/placeholder.png'"
                alt="Staff"
                class="object-cover w-24 h-24 mx-auto mb-4 border-2 rounded-full border-maroon"
              />
              <h3 class="text-lg font-semibold text-center text-maroon">
                {{ staff.fullName || staff.name }}
              </h3>
              <p class="text-sm text-center text-gray-600">
                {{ staff.designation || "No designation" }}
              </p>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Profile Modal -->
    <ProfilePreviewModal v-if="showModal" :profile="selectedProfile" @close="showModal = false" />
  </div>
</template>

<script setup lang="ts">
  import ProfilePreviewModal from "@/components/ProfilePreviewModal.vue";
  import { doc } from "firebase/firestore";
  import { useRoute } from "vue-router";
  import { useDocument, useFirestore } from "vuefire";

  const route = useRoute();
  const deptId = route.params.id as string;
  const db = useFirestore();

  const { data: dept } = useDocument(doc(db, "departments", deptId));

  const showModal = ref(false);
  const selectedProfile = ref<any>(null);

  function openProfile(profile: any, role: string) {
    selectedProfile.value = {
      ...profile,
      role,
      departmentName: dept.value?.name || "",
    };
    showModal.value = true;
  }
</script>

<style scoped>
  .text-maroon {
    color: #740505;
  }
  .border-maroon {
    border-color: #740505;
  }
</style>
