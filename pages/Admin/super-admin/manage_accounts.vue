<template>
    <main class="p-8">
      <div class="flex justify-between">
        <div class="flex flex-col">
          <span class="text-2xl font-bold text-red-900">User Accounts</span>
          <span class="text-sm">Manage roles, department, and access</span>
        </div>

        <UiButton
          @click="showCreateAccountModal = true"
          class="px-4 py-2 text-white bg-red-900 rounded hover:bg-red-700"
        >
          Create Account
        </UiButton>
      </div>
      <CreateAccountModal v-if="showCreateAccountModal" @close="showCreateAccountModal = false" />
      
      <!-- Search Bar -->
      <div class="flex justify-between mt-2 mb-6">
        <div class="flex items-center justify-between w-3/4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users by name or email..."
            class="w-1/3 px-4 py-2 border rounded"
          />
        </div>
        <!-- filter -->
        <div class="">
          <select v-model="selectedRole" class="flex justify-between px-8 py-2 border rounded select-bordered">
            <option disabled value="">Choose Role </option>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
        </div>
      </div>
  
      <!-- User List -->
      <div class="bg-white rounded shadow-md">
        <table class="w-full text-center border-collapse table-auto">
          <thead>
            <tr class="text-center bg-gray-100 border-b">
              <th class="px-6 py-4">Profile</th>
              <th class="px-6 py-4">Email</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b hover:bg-gray-50"
            >
              <!-- Profile Picture -->
              <td class="flex items-center px-4 py-2 space-x-3">
                <img
                  :src="user.photo || '/placeholder.png'"
                  alt="Profile"
                  class="object-cover rounded-full size-12"
                />
                <div class="flex flex-col items-start">
                  <span class="text-base font-semibold font-trajan">{{ user.fullName || "Unnamed" }}</span>
                  <span class="text-xs">{{ user.role || "Unknown" }}</span>
                </div>
              </td>
              <!-- Email -->
              <td class="px-4 py-1">{{ user.email }}</td>
              <!-- Status -->
              <td class="px-4 py-1">
                <span
                  :class="user.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
                  class="px-3 py-1 text-sm font-semibold rounded-full"
                >
                  {{ user.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <!-- Actions -->
              <td class="px-4 py-1 ">
                <UiButton
                  @click="toggleStatus(user)"
                  :class="user.status === 'active' ? 'bg-red-900 hover:bg-red-950' : 'bg-green-500 hover:bg-green-600'"
                  class="px-2 py-1 text-white rounded"
                >
                  {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
                </UiButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { getFirestore, collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
  
  definePageMeta({
    middleware: "auth",
    layout: "super-admin",
  });
  
  const showCreateAccountModal = ref(false)
  const db = getFirestore();
  const users = ref([]);
  const searchQuery = ref("");
  const selectedRole = ref('')
  
  // ✅ Use fullName instead of firstName + lastName
  onMounted(() => {
    const usersCollection = collection(db, "users");
    onSnapshot(usersCollection, (snapshot) => {
      users.value = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.role !== "Super Admin");
    });
  });
  
  // ✅ Updated search to check fullName instead of first/last separately
  const filteredUsers = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return users.value.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  });
  
  // ✅ Update alert message to use fullName
  const toggleStatus = async (user) => {
    const userDocRef = doc(db, "users", user.id);
    const newStatus = user.status === "active" ? "inactive" : "active";
  
    try {
      await updateDoc(userDocRef, { status: newStatus });
      alert(
        `${user.fullName} has been ${
          newStatus === "active" ? "activated" : "deactivated"
        }`
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update user status. Please try again.");
    }
  };
  </script>
  
<style scoped>
  *{
    outline: 1px solid red;
  }
</style>
  