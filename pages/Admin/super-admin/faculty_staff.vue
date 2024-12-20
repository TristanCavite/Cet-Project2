<template>
  <div class="pl-10 pr-10 pt-28">
    <h1 class="mb-6 text-2xl font-bold text-maroon">Offices and Administrator</h1>

    <!-- Add Faculty/Staff Button -->
    <button
      @click="showAddModal = true"
      class="px-4 py-2 text-white rounded shadow bg-maroon hover:bg-red-600"
    >
      + Add Faculty and Staff
    </button>

    <!-- College Dean Section -->
    <div class="mt-8" v-if="collegeDean">
      <h2 class="mb-4 text-xl font-semibold text-center">College Dean</h2>
      <div class="flex justify-center">
        <div class="text-center cursor-pointer" @click="showProfilePreview(collegeDean)">
          <img
            :src="collegeDean.photo || '/placeholder.png'"
            alt="College Dean"
            class="object-cover w-32 h-32 mx-auto rounded-full"
          />
          <p class="mt-2 text-lg font-bold">
            {{ collegeDean ? `${collegeDean.firstName} ${collegeDean.lastName}` : "No Dean Assigned" }}
          </p>

          
        </div>
      </div>
    </div>

    <!-- Head Members Section -->
    <div class="mt-12" v-if="headAdmins.length">
      <h2 class="mb-4 text-xl font-semibold text-center">Head Members</h2>
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
            class="object-cover w-24 h-24 mx-auto rounded-full"
          />
          <p class="mt-2 text-lg font-bold">
            {{ headAdmins? `${head.firstName} ${head.lastName}` : "No head Assigned" }}
          </p>
          
        </div>
      </div>
    </div>

    <!-- Staff Section -->
    <div class="mt-12" v-if="adminStaff.length">
      <h2 class="mb-4 text-xl font-semibold text-center">Staff</h2>
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
            class="object-cover w-24 h-24 mx-auto rounded-full"
          />
            <p class="mt-2 text-lg font-bold">
            {{ adminStaff? `${staff.firstName} ${staff.lastName}` : "No staff Assigned" }}
          </p>
          
        </div>
      </div>
    </div>

    <!-- Profile Preview Modal -->
<div
  v-if="showProfilePreviewModal"
  class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
>
  <div class="w-2/3 max-w-3xl p-8 bg-white rounded-lg shadow-lg">
    <div class="relative text-center">
      <!-- Profile Picture -->
      <img
        :src="selectedProfile?.photo || '/placeholder.png'"
        alt="Profile Picture"
        class="object-cover w-32 h-32 mx-auto rounded-full shadow-lg"
      />
      <!-- Name -->
      <h2 class="mt-4 text-2xl font-bold text-maroon">
        {{ selectedProfile?.name || "No Name Provided" }}
      </h2>
      <!-- Designation -->
      <p class="text-lg font-semibold text-gray-500">
        {{ selectedProfile?.designation || "No Designation" }}
      </p>

      <!-- Delete/Deactivate Button -->
      <div
        class="absolute top-0 right-0 text-red-500 cursor-pointer hover:text-red-700"
        @click="flagUserAsInactive(selectedProfile)"
      >
        <Trash class="w-6 h-6" />
      </div>
    </div>

    <!-- Profile Details -->
    <div class="mt-6 space-y-4 text-lg">
      <!-- Specialization -->
      <div>
        <p class="font-semibold text-maroon">Specialization:</p>
        <p>{{ selectedProfile?.specialization || "N/A" }}</p>
      </div>
      <!-- Email -->
      <div>
        <p class="font-semibold text-maroon">Email:</p>
        <p>{{ selectedProfile?.email || "N/A" }}</p>
      </div>
      <!-- Highest Educational Attainment -->
      <div>
        <p class="font-semibold text-maroon">Highest Educational Attainment:</p>
        <span class="prose text-black" v-html="selectedProfile?.education || 'N/A'"></span>
      </div>
      <!-- Websites -->
      <div>
        <p class="font-semibold text-maroon">Websites:</p>
        <div>
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
        </div>
      </div>
    </div>

    <!-- Close Button -->
    <div class="mt-6 text-center">
      <button
        class="px-6 py-2 text-white rounded-lg shadow bg-maroon hover:bg-red-700"
        @click="closeProfilePreviewModal"
      >
        Close
      </button>
    </div>
  </div>
</div>

    <!-- Add Faculty/Staff Modal -->
    <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="p-8 bg-white rounded shadow-lg w-96">
        <h2 class="mb-4 text-lg font-bold">Add Faculty/Staff</h2>

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
              class="w-full px-3 py-2 pl-10 border rounded"
            />
            <Search class="absolute w-5 h-5 text-gray-500 left-3 top-2" />
          </div>
          <ul
            v-if="dropdownVisible && filteredUsers.length"
            class="absolute z-10 w-full mt-1 bg-white border rounded shadow"
          >
            <li
              v-for="user in filteredUsers"
              :key="user.id"
              :class="{
                'bg-yellow-100': user.status === 'inactive', // Highlight inactive users
                'hover:bg-gray-200': true,
                'cursor-pointer': true,
              }"
              @mousedown="selectUser(user)"
            >
              {{ user.name }} <span v-if="user.status === 'inactive'" class="text-red-500">(Inactive)</span>
            </li>
          </ul>
        </div>

        <!-- Designation Dropdown -->
        <div v-if="selectedUser.role !== 'Head Admin'" class="mb-4">
          <label class="block text-sm font-medium">Designation:</label>
          <select v-model="selectedUser.designation" class="w-full px-3 py-2 border rounded">
            <option value="" disabled>Select Designation</option>
            <option value="College Dean">College Dean</option>
            <option value="Staff">Staff</option>
          </select>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-4 space-x-2">
          <button
            @click="resetModal"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            @click="addFacultyOrStaff"
            class="px-4 py-2 text-white rounded bg-maroon hover:bg-red-600"
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
import Trash from "@/components/Icons/trash.vue";
import { ref, onMounted } from "vue";
import {
  getFirestore,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";

const db = getFirestore();

// State variables
const collegeDean = ref(null);
const headAdmins = ref([]);
const adminStaff = ref([]);
const showAddModal = ref(false);
const showProfilePreviewModal = ref(false);
const selectedProfile = ref(null);
const users = ref([]);
const filteredUsers = ref([]);
const searchQuery = ref("");
const selectedUser = ref({});

definePageMeta({
  middleware: "auth",
  layout: "super-admin",
});

// Real-time listener for Faculty and Staff
const fetchCollegeFacultyStaffRealTime = () => {
  const docRef = doc(db, "college_faculty_staff", "college-wide");

  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();

      // Filter out inactive college dean
      collegeDean.value = data.collegeDean?.status === "inactive" ? null : data.collegeDean;

      // Filter out inactive head admins
      headAdmins.value = (data.headAdmins || []).filter((admin) => admin.status !== "inactive");

      // Filter out inactive admin staff
      adminStaff.value = (data.adminStaff || []).filter((staff) => staff.status !== "inactive");
    } else {
      console.error("college-wide document not found.");
    }
  });
};


// Synchronize changes from `users` to `college_faculty_staff`
const syncUserChangesToCollege = () => {
  const usersCollection = collection(db, "users");
  onSnapshot(usersCollection, async (snapshot) => {
    const updatedUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const collegeDocRef = doc(db, "college_faculty_staff", "college-wide");
    const collegeDoc = await getDoc(collegeDocRef);

    if (collegeDoc.exists()) {
      const collegeData = collegeDoc.data();

      // Update collegeDean if their data changes and is not inactive
      if (collegeData.collegeDean?.id) {
        const updatedDean = updatedUsers.find(
          (user) => user.id === collegeData.collegeDean.id && user.status !== "inactive"
        );
        if (updatedDean) {
          await updateDoc(collegeDocRef, { collegeDean: updatedDean });
        } else {
          await updateDoc(collegeDocRef, { collegeDean: null }); // Remove inactive dean
        }
      }

      // Update headAdmins dynamically, excluding inactive users
      const updatedHeadAdmins = collegeData.headAdmins
        .map((admin) => updatedUsers.find((user) => user.id === admin.id && user.status !== "inactive"))
        .filter(Boolean); // Remove undefined entries
      await updateDoc(collegeDocRef, { headAdmins: updatedHeadAdmins });

      // Update adminStaff dynamically, excluding inactive users
      const updatedAdminStaff = collegeData.adminStaff
        .map((staff) => updatedUsers.find((user) => user.id === staff.id && user.status !== "inactive"))
        .filter(Boolean); // Remove undefined entries
      await updateDoc(collegeDocRef, { adminStaff: updatedAdminStaff });
    }
  });
};

// Function to show profile preview
const showProfilePreview = (profile) => {
  selectedProfile.value = {
    ...profile,
    name: profile.name || `${profile.firstName || ""} ${profile.lastName || ""}`.trim(),
  };
  showProfilePreviewModal.value = true;
};

// Function to close profile preview modal
const closeProfilePreviewModal = () => {
  selectedProfile.value = null;
  showProfilePreviewModal.value = false;
};

// Function to flag user as inactive
const flagUserAsInactive = async (user) => {
  const userDocRef = doc(db, "users", user.id);
  try {
    const confirm = window.confirm(`Are you sure you want to deactivate ${user.name}?`);
    if (confirm) {
      await updateDoc(userDocRef, { status: "inactive" });
      alert(`${user.name} has been flagged as inactive.`);
    }
  } catch (error) {
    console.error("Error flagging user as inactive:", error);
    alert("Failed to flag the user as inactive. Please try again.");
  }
};

// Function to reactivate a user
const reactivateUser = async (user) => {
  const userDocRef = doc(db, "users", user.id);
  try {
    await updateDoc(userDocRef, { status: "active" });
    alert(`${user.name} has been reactivated.`);
  } catch (error) {
    console.error("Error reactivating user:", error);
    alert("Failed to reactivate the user. Please try again.");
  }
};

// Filter users based on search query
const filterUsers = () => {
  const query = searchQuery.value.toLowerCase();
  filteredUsers.value = query
    ? users.value.filter((user) => user.name.toLowerCase().includes(query))
    : [...users.value];
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

  const userDocRef = doc(db, "users", selectedUser.value.id);
  const docRef = doc(db, "college_faculty_staff", "college-wide");

  try {
    // Update the user's designation in the `users` collection
    await updateDoc(userDocRef, { 
      designation: selectedUser.value.designation || "No Designation", 
      status: "active" 
    });

    
    // Add the user to the appropriate section
    if (selectedUser.value.designation === "College Dean") {
      await updateDoc(docRef, { collegeDean: selectedUser.value });
    } else if (selectedUser.value.designation === "Staff") {
      await updateDoc(docRef, {
        adminStaff: arrayUnion(selectedUser.value),
      });
    } else if (selectedUser.value.role === "Head Admin") {
      await updateDoc(docRef, {
        headAdmins: arrayUnion(selectedUser.value),
      });
    }

    resetModal();
    alert("Faculty/Staff successfully added!");
  } catch (error) {
    console.error("Error adding Faculty/Staff:", error);
    alert("Failed to add Faculty/Staff. Please try again.");
  }
};

// Fetch data on page load
onMounted(() => {
  const usersCollection = collection(db, "users");
  onSnapshot(usersCollection, (snapshot) => {
    users.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      name: `${doc.data().firstName || ""} ${doc.data().lastName || ""}`.trim(),
    }));
    filterUsers();
  });

  fetchCollegeFacultyStaffRealTime();
  syncUserChangesToCollege();
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
