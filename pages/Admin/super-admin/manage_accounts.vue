<template>
    <div class="p-8">
      <h1 class="text-2xl font-bold mb-6 text-maroon">User Management</h1>
  
      <!-- Search Bar -->
      <div class="flex justify-between items-center mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users by name or email..."
          class="border rounded px-4 py-2 w-1/3"
        />
      </div>
  
      <!-- User List -->
      <div class="bg-white rounded shadow-md">
        <table class="table-auto w-full border-collapse text-left">
          <thead>
            <tr class="bg-gray-100 border-b">
              <th class="px-6 py-4">Profile</th>
              <th class="px-6 py-4">User Name</th>
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
              <td class="px-6 py-4 flex items-center">
                <img
                  :src="user.photo || '/placeholder.png'"
                  alt="Profile"
                  class="h-10 w-10 rounded-full object-cover mr-3"
                />
                <span>{{ user.firstName }} {{ user.lastName }}</span>
              </td>
              <!-- Name -->
              <td class="px-6 py-4">{{ user.firstName }} {{ user.lastName }}</td>
              <!-- Email -->
              <td class="px-6 py-4">{{ user.email }}</td>
              <!-- Status -->
              <td class="px-6 py-4">
                <span
                  :class="user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
                  class="px-3 py-1 text-sm font-semibold rounded-full"
                >
                  {{ user.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <!-- Actions -->
              <td class="px-6 py-4">
                <button
                  @click="toggleStatus(user)"
                  :class="user.status === 'active' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
                  class="text-white px-4 py-2 rounded"
                >
                  {{ user.status === 'active' ? 'Deactivate' : 'Activate' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { getFirestore, collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
  
  // Page Metadata
  definePageMeta({
    middleware: "auth", // Protect this page
    layout: "super-admin", // Use specific layout
  });
  
  const db = getFirestore();
  const users = ref([]);
  const searchQuery = ref("");
  
  // Fetch Users in Real-Time (Exclude Super Admin)
  onMounted(() => {
    const usersCollection = collection(db, "users");
    onSnapshot(usersCollection, (snapshot) => {
      users.value = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.role !== "Super Admin"); // Exclude super admin
    });
  });
  
  // Filter Users Based on Search Query
  const filteredUsers = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return users.value.filter(
      (user) =>
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  });
  
  // Toggle User Status (Activate/Deactivate)
  const toggleStatus = async (user) => {
    const userDocRef = doc(db, "users", user.id);
    const newStatus = user.status === "active" ? "inactive" : "active";
  
    try {
      await updateDoc(userDocRef, { status: newStatus });
      alert(
        `${user.firstName} ${user.lastName} has been ${
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
  .text-maroon {
    color: #740505;
  }
  
  .bg-maroon {
    background-color: #740505;
  }
  </style>
  