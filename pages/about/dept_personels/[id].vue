<template>
  <div class="min-h-screen bg-neutral-100">
    <!-- 🔒 Left-Aligned Title Cover Image Block -->
    <div class="relative flex w-full items-center border-b-2 font-playfair">
      <img src="/CET Faculty.jpg" alt="Department Cover" class="h-128 w-full object-cover" />
      <div class="absolute left-[120px] flex h-28 w-224 items-center bg-gray-700 bg-opacity-90">
        <span class="pl-5 text-5xl text-white">
          {{ dept?.name || "Department" }}
        </span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="mx-auto max-w-6xl px-4 py-12">
     <!-- Head Admin -->
<div v-if="dept?.headAdmin" class="mb-12">
  <h2 class="mb-6 text-3xl font-bold text-maroon text-center">Department Head</h2>
  <div
    @click="openProfile(dept.headAdmin, 'Head Admin')"
    class="bg-white rounded-lg p-6 shadow hover:shadow-lg transition cursor-pointer w-full sm:w-96 mx-auto"
  >
    <img
      :src="dept.headAdmin.photo || '/placeholder.png'"
      alt="Head Admin"
      class="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-maroon"
    />
    <h3 class="text-center text-lg font-semibold text-maroon">
      {{ dept.headAdmin.fullName || dept.headAdmin.name }}
    </h3>
    <p class="text-center text-sm text-gray-600">
      Department Head – {{ dept.name }}
    </p>
    <p class="text-center text-sm text-gray-500">
      {{ dept.headAdmin.designation || 'No designation' }}
    </p>
  </div>
</div>

<!-- Staff -->
<div v-if="dept?.staff?.length">
  <h2 class="mb-6 text-3xl font-bold text-maroon text-center">Faculty and Staff</h2>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
    <template v-for="(staff, index) in dept.staff" :key="index">
      <div
        v-if="staff.status === 'active'"
        class="cursor-pointer rounded-lg bg-white p-6 shadow transition hover:shadow-lg"
        @click="openProfile(staff, 'Staff')"
      >
        <img
          :src="staff.photo || '/placeholder.png'"
          alt="Staff"
          class="mx-auto mb-4 h-24 w-24 rounded-full border-2 border-maroon object-cover"
        />
        <h3 class="text-center text-lg font-semibold text-maroon">
          {{ staff.fullName || staff.name }}
        </h3>
        <p class="text-center text-sm text-gray-600">
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
