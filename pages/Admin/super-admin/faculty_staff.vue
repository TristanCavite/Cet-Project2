<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6 text-maroon">Offices and Administrator</h1>

    <!-- Add Faculty/Staff Button -->
    <button
      @click="showAddModal = true"
      class="px-4 py-2 bg-maroon text-white rounded shadow hover:bg-red-600"
    >
      + Add Faculty and Staff
    </button>

    <!-- College Dean Section -->
    <div class="mt-8" v-if="collegeDean">
      <h2 class="text-xl font-semibold text-center mb-4">College Dean</h2>
      <div class="flex justify-center">
        <div class="text-center">
          <img
            :src="collegeDean.photo || '/placeholder.png'"
            alt="College Dean"
            class="w-32 h-32 rounded-full object-cover mx-auto"
          />
          <p class="mt-2 font-bold text-lg">{{ collegeDean.name || "No Dean Assigned" }}</p>
          <p class="text-gray-600">{{ collegeDean.position }}</p>
        </div>
      </div>
    </div>

    <!-- Head Members Section -->
    <div class="mt-12" v-if="headAdmins.length">
      <h2 class="text-xl font-semibold text-center mb-4">Head Members</h2>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="head in headAdmins" :key="head.id" class="text-center">
          <img
            :src="head.photo || '/placeholder.png'"
            alt="Head Member"
            class="w-24 h-24 rounded-full object-cover mx-auto"
          />
          <p class="mt-2 font-bold text-sm">{{ head.name }}</p>
          <p class="text-gray-600 text-sm">{{ head.position }}</p>
        </div>
      </div>
    </div>

    <!-- Staff Section -->
    <div class="mt-12" v-if="adminStaff.length">
      <h2 class="text-xl font-semibold text-center mb-4">Staff</h2>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="staff in adminStaff" :key="staff.id" class="text-center">
          <img
            :src="staff.photo || '/placeholder.png'"
            alt="Staff"
            class="w-24 h-24 rounded-full object-cover mx-auto"
          />
          <p class="mt-2 font-bold text-sm">{{ staff.name }}</p>
          <p class="text-gray-600 text-sm">{{ staff.position }}</p>
        </div>
      </div>
    </div>

    <!-- Add Faculty/Staff Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-8 rounded shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">Add Faculty/Staff</h2>

        <!-- Search Bar with Suggestions -->
<div class="relative mb-4">
  <div class="relative">
    <input
      v-model="searchQuery"
      @focus="dropdownVisible = true"
      @input="filterUsers"
      @blur="hideDropdown"
      type="text"
      placeholder="Search Faculty"
      class="w-full border rounded px-3 py-2 pl-10"
    />
    <Search class="absolute left-3 top-2 text-gray-500 w-5 h-5" />
  </div>
  <ul
    v-if="dropdownVisible && filteredUsers.length"
    class="absolute w-full bg-white border rounded shadow mt-1 z-10"
  >
    <li
      v-for="user in filteredUsers"
      :key="user.id"
      class="px-3 py-2 hover:bg-gray-200 cursor-pointer"
      @mousedown="selectUser(user)"
    >
      {{ user.name }}
    </li>
  </ul>
</div>


        <!-- Designation Dropdown -->
        <div class="mb-4">
          <label class="block text-sm font-medium">Designation:</label>
          <select v-model="selectedUser.role" class="w-full border rounded px-3 py-2">
            <option value="" disabled>Select Designation</option>
            <option value="College Dean">College Dean</option>
            <option value="Head Admin">Head Admin</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2 mt-4">
          <button
            @click="resetModal"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="addFacultyOrStaff"
            class="px-4 py-2 bg-maroon text-white rounded hover:bg-red-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Search from "@/components/Icons/Search.vue";
import { ref } from "vue";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

const db = getFirestore();

// State variables
const collegeDean = ref(null);
const headAdmins = ref([]);
const adminStaff = ref([]);
const showAddModal = ref(false);
const users = ref([]);
const filteredUsers = ref([]);
const searchQuery = ref("");
const selectedUser = ref({});

definePageMeta({
    middleware: 'auth',
    layout: "super-admin", // Optional: use specific layout
  });

// Fetch data from Firestore
const fetchCollegeFacultyStaff = async () => {
  const docRef = doc(db, "college_faculty_staff", "college-wide");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    collegeDean.value = data.collegeDean || null;
    headAdmins.value = data.headAdmins || [];
    adminStaff.value = data.adminStaff || [];
  } else {
    console.error("No such document!");
  }
};

const fetchUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    users.value = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          name: data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : null, // Only construct name if both exist
        };
      })
      .filter(
        (user) =>
          user.role !== "Super Admin" && // Exclude Super Admin
          user.name // Include only users with valid names
      );

    filteredUsers.value = [...users.value]; // Initially show all users
    console.log("Fetched users:", users.value); // Debugging log
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};


const filterUsers = () => {
  const query = searchQuery.value.toLowerCase();
  filteredUsers.value = query
    ? users.value.filter((user) =>
        user.name.toLowerCase().includes(query)
      )
    : [...users.value]; // Show all users if query is empty
};

const selectUser = (user) => {
  selectedUser.value = { ...user };
  searchQuery.value = user.name;
  filteredUsers.value = [];
};

const resetModal = () => {
  selectedUser.value = {};
  searchQuery.value = "";
  showAddModal.value = false;
};

const addFacultyOrStaff = async () => {
  if (!selectedUser.value.id || !selectedUser.value.role) {
    alert("Please select a user and assign a designation.");
    return;
  }

  const docRef = doc(db, "college_faculty_staff", "college-wide");

  if (selectedUser.value.role === "College Dean") {
    await updateDoc(docRef, { collegeDean: selectedUser.value });
  } else if (selectedUser.value.role === "Head Admin") {
    await updateDoc(docRef, {
      headAdmins: arrayUnion(selectedUser.value),
    });
  } else if (selectedUser.value.role === "Staff") {
    await updateDoc(docRef, {
      adminStaff: arrayUnion(selectedUser.value),
    });
  }

  await fetchCollegeFacultyStaff();
  resetModal();
  alert("Faculty/Staff successfully added!");
};

// Fetch data on page load
fetchCollegeFacultyStaff();
fetchUsers();
</script>

<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>
