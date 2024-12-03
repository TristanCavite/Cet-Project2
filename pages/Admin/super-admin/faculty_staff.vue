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
        <div class="text-center cursor-pointer" @click="showProfilePreview(collegeDean)">
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
        <div
          v-for="head in headAdmins"
          :key="head.id"
          class="text-center cursor-pointer"
          @click="showProfilePreview(head)"
        >
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
        <div
          v-for="staff in adminStaff"
          :key="staff.id"
          class="text-center cursor-pointer"
          @click="showProfilePreview(staff)"
        >
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

    <!-- Profile Preview Modal -->
    <div
      v-if="showProfilePreviewModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded shadow-lg w-2/3 max-w-3xl">
        <div class="text-center">
          <img
            :src="selectedProfile?.photo || '/placeholder.png'"
            alt="Profile Picture"
            class="w-32 h-32 rounded-full object-cover mx-auto"
          />
          <h2 class="mt-4 text-2xl font-bold text-maroon">{{ selectedProfile?.name }}</h2>
          <p class="text-gray-600 text-lg font-semibold">{{ selectedProfile?.designation }}</p>
        </div>
        <div class="mt-6 space-y-4 text-lg">
          <p><strong>Specialization:</strong> {{ selectedProfile?.specialization || "N/A" }}</p>
          <p><strong>Email:</strong> {{ selectedProfile?.email || "N/A" }}</p>
          <p>
            <strong>Highest Educational Attainment:</strong>
            <span class="prose text-black" v-html="selectedProfile?.education"></span>
          </p>
          <p>
            <strong>Websites:</strong>
            <span v-if="selectedProfile?.websites?.length">
              <span
                v-for="(website, index) in selectedProfile.websites"
                :key="index"
                class="block text-blue-500 underline"
              >
                <a :href="website" target="_blank">{{ website }}</a>
              </span>
            </span>
            <span v-else>No websites provided</span>
          </p>
        </div>
        <div class="mt-6 text-center">
          <button
            class="bg-gray-300 px-6 py-2 rounded shadow hover:bg-gray-400"
            @click="closeProfilePreviewModal"
          >
            Close
          </button>
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
        <div v-if="selectedUser.role !== 'Head Admin'" class="mb-4">
          <label class="block text-sm font-medium">Designation:</label>
          <select v-model="selectedUser.designation" class="w-full border rounded px-3 py-2">
            <option value="" disabled>Select Designation</option>
            <option value="College Dean">College Dean</option>
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
import { ref, onMounted } from "vue";
import {
  getFirestore,
  collection,
  onSnapshot,
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
const showProfilePreviewModal = ref(false); // To control profile preview modal visibility
const selectedProfile = ref(null); // Stores the selected profile for preview
const users = ref([]);
const filteredUsers = ref([]);
const searchQuery = ref("");
const selectedUser = ref({});

definePageMeta({
  middleware: "auth",
  layout: "super-admin", // Optional: use specific layout
});

// Real-time listener for Faculty and Staff
const fetchCollegeFacultyStaffRealTime = () => {
  const usersCollection = collection(db, "users");

  onSnapshot(usersCollection, (snapshot) => {
    users.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      name: `${doc.data().firstName || ""} ${doc.data().lastName || ""}`.trim(),
    }));

    // Update filtered users initially
    filteredUsers.value = [...users.value];

    // Assign users to appropriate roles in the UI
    assignRoles(users.value);
  });
};

// Function to assign roles dynamically
const assignRoles = (usersList) => {
  collegeDean.value = usersList.find((user) => user.designation === "College Dean") || null;
  headAdmins.value = usersList.filter((user) => user.role === "Head Admin");
  adminStaff.value = usersList.filter((user) => user.designation === "Staff");
};

// Function to show profile preview
const showProfilePreview = (profile) => {
  selectedProfile.value = profile;
  showProfilePreviewModal.value = true;
};

// Function to close profile preview modal
const closeProfilePreviewModal = () => {
  selectedProfile.value = null;
  showProfilePreviewModal.value = false;
};

// Filter users based on search query
const filterUsers = () => {
  const query = searchQuery.value.toLowerCase();
  filteredUsers.value = query
    ? users.value.filter((user) =>
        user.name.toLowerCase().includes(query)
      )
    : [...users.value]; // Show all users if query is empty
};

// Select a user from the search suggestions
const selectUser = (user) => {
  selectedUser.value = { ...user };
  searchQuery.value = user.name;
  filteredUsers.value = [];
};

// Reset the modal
const resetModal = () => {
  selectedUser.value = {};
  searchQuery.value = "";
  showAddModal.value = false;
};

// Add a faculty or staff member
const addFacultyOrStaff = async () => {
  if (!selectedUser.value.id) {
    alert("Please select a user.");
    return;
  }

  if (
    selectedUser.value.role === "Faculty" &&
    !selectedUser.value.designation
  ) {
    alert("Please select a designation for the faculty member.");
    return;
  }

  const docRef = doc(db, "college_faculty_staff", "college-wide");
  const userDocRef = doc(db, "users", selectedUser.value.id);

  try {
    if (selectedUser.value.role === "Faculty") {
      // Update Firestore with designation
      await updateDoc(userDocRef, { designation: selectedUser.value.designation });

      // Add the user to the appropriate section
      if (selectedUser.value.designation === "College Dean") {
        await updateDoc(docRef, { collegeDean: selectedUser.value });
      } else if (selectedUser.value.designation === "Staff") {
        await updateDoc(docRef, {
          adminStaff: arrayUnion(selectedUser.value),
        });
      }
    } else if (selectedUser.value.role === "Head Admin") {
      await updateDoc(docRef, {
        headAdmins: arrayUnion(selectedUser.value),
      });
    }

    resetModal();
    alert("Faculty/Staff successfully added!");
  } catch (error) {
    console.error("Error updating Firestore:", error);
    alert("Failed to add Faculty/Staff. Please try again.");
  }
};

// Fetch data on page load
onMounted(() => {
  fetchCollegeFacultyStaffRealTime(); // Real-time listener
});
</script>




<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>
