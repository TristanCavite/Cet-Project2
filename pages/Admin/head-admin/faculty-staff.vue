<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6 text-maroon">Department Faculty and Staff</h1>

    <!-- Add Faculty/Staff Button -->
    <button
      @click="showAddModal = true"
      class="px-4 py-2 bg-maroon text-white rounded shadow hover:bg-red-600"
    >
      + Add Faculty and Staff
    </button>

    <!-- Department Head Section -->
    <div class="mt-8" v-if="departmentHead">
      <h2 class="text-xl font-semibold text-center mb-4">Department Head</h2>
      <div class="flex justify-center">
        <div class="text-center cursor-pointer" @click="showProfilePreview(departmentHead)">
          <img
            :src="departmentHead?.photo || '/placeholder.png'"
            alt="Department Head"
            class="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
          />
          <p class="mt-2 font-bold text-lg">
            {{ departmentHead ? `${departmentHead.firstName} ${departmentHead.lastName}` : "No Head Assigned" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Staff Section -->
    <div class="mt-12" v-if="departmentStaff.length">
      <h2 class="text-xl font-semibold text-center mb-4">Staff</h2>
      <div class="grid grid-cols-4 gap-6">
        <div
          v-for="staff in departmentStaff"
          :key="staff.id"
          class="text-center cursor-pointer"
          @click="showProfilePreview(staff)"
        >
          <img
            :src="staff.photo || '/placeholder.png'"
            alt="Staff"
            class="w-24 h-24 rounded-full object-cover mx-auto shadow-lg"
          />
          <p class="mt-2 font-bold text-lg">
            {{ staff ? `${staff.firstName} ${staff.lastName}` : "No Staff Assigned" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Profile Preview Modal -->
    <div
      v-if="showProfilePreviewModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-3xl">
        <div class="text-center relative">
          <!-- Profile Picture -->
          <img
            :src="selectedProfile?.photo || '/placeholder.png'"
            alt="Profile Picture"
            class="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
          />
          <!-- Name -->
          <h2 class="mt-4 text-2xl font-bold text-maroon">
            {{ selectedProfile?.name || "No Name Provided" }}
          </h2>
          <!-- Designation -->
          <p class="text-gray-500 text-lg font-semibold">
            {{ selectedProfile?.designation || "No Designation" }}
          </p>

          <!-- Delete/Deactivate Button -->
          <div
            class="absolute top-0 right-0 cursor-pointer text-red-500 hover:text-red-700"
            @click="removeUserFromDepartment(selectedProfile)"
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
            class="bg-maroon text-white px-6 py-2 rounded-lg shadow hover:bg-red-700"
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
        <div class="mb-4">
          <label class="block text-sm font-medium">Designation:</label>
          <select v-model="selectedUser.designation" class="w-full border rounded px-3 py-2">
            <option value="" disabled>Select Designation</option>
            <option
              v-for="designation in designations"
              :key="designation"
              :value="designation"
            >
              {{ designation }}
            </option>
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
import Trash from "@/components/Icons/trash.vue";
import { ref, onMounted } from "vue";
import {
  getFirestore,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Page metadata
definePageMeta({
  middleware: "auth", // Protect this page
  layout: "head-admin", // Use head-admin layout
});

const db = getFirestore();
const auth = getAuth();

// State variables
const departmentHead = ref(null);
const departmentStaff = ref([]);
const showAddModal = ref(false);
const showProfilePreviewModal = ref(false);
const selectedProfile = ref(null);
const users = ref([]);
const filteredUsers = ref([]);
const searchQuery = ref("");
const selectedUser = ref({});
let departmentId = ""; // To be dynamically fetched
const dropdownVisible = ref(false); // Added missing dropdownVisible

// Designation list specific to the Head Admin page
const designations = [
  "Department Head",
  "Instructor I",
  "Instructor II",
  "Instructor III",
  "Assistant Professor I",
  "Assistant Professor II",
  "Assistant Professor III",
  "Assistant Professor IV",
  "Associate Professor I",
  "Associate Professor II",
  "Associate Professor III",
  "Associate Professor IV",
  "Associate Professor V",
  "Professor I",
  "Professor II",
  "Professor III",
  "Part-time Instructor",
];

// Dynamically fetch `departmentId` and set up real-time listeners
onMounted(async () => {
  const currentUser = auth.currentUser; // Get the currently logged-in user

  if (!currentUser) {
    console.error("No user is currently logged in.");
    return;
  }

  try {
    const userDocRef = doc(db, "users", currentUser.uid); // Fetch the logged-in user's document
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      departmentId = userDoc.data().departmentId;

      if (!departmentId) {
        console.error("Department ID is missing in the user document.");
        return;
      }

      // Fetch department data
      fetchDepartmentFacultyStaffRealTime();
      syncUserChangesToDepartment();
    } else {
      console.error("User document not found in Firestore.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
});

const fetchDepartmentFacultyStaffRealTime = () => {
  if (!departmentId) {
    console.error("Department ID is not available.");
    return;
  }

  const docRef = doc(db, "college_faculty_staff", departmentId);

  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();

      // Ensure departmentHead has firstName and lastName
      departmentHead.value = data.departmentHead?.status !== "inactive"
        ? {
            ...data.departmentHead,
            firstName: data.departmentHead.firstName || data.departmentHead.name?.split(" ")[0] || "No",
            lastName: data.departmentHead.lastName || data.departmentHead.name?.split(" ").slice(1).join(" ") || "Name",
          }
        : null;

      // Ensure each staff member in departmentStaff has firstName and lastName
      departmentStaff.value = (data.departmentStaff || [])
        .filter((staff) => staff.status !== "inactive")
        .map((staff) => ({
          ...staff,
          firstName: staff.firstName || staff.name?.split(" ")[0] || "No",
          lastName: staff.lastName || staff.name?.split(" ").slice(1).join(" ") || "Name",
        }));
    } else {
      console.error("Department document not found.");
    }
  });
};

// Synchronize changes from `users` to department collection
const syncUserChangesToDepartment = () => {
  const usersCollection = collection(db, "users");

  onSnapshot(usersCollection, async (snapshot) => {
    const updatedUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const departmentDocRef = doc(db, "college_faculty_staff", departmentId);
    const departmentDoc = await getDoc(departmentDocRef);

    if (departmentDoc.exists()) {
      const departmentData = departmentDoc.data();

      const syncWithPreservation = (entry) => {
        const matchedUser = updatedUsers.find(
          (user) => user.id === entry.id && user.status !== "inactive"
        );
        if (matchedUser) {
          return {
            ...entry, // Preserve department-specific fields like designation
            name: `${matchedUser.firstName || ""} ${matchedUser.lastName || ""}`.trim(),
            photo: matchedUser.photo || entry.photo,
            email: matchedUser.email || entry.email,
            specialization: matchedUser.specialization || entry.specialization,
            status: matchedUser.status,
          };
        }
        return entry;
      };

      // Update department head
      if (departmentData.departmentHead?.id) {
        const updatedHead = syncWithPreservation(departmentData.departmentHead);
        await updateDoc(departmentDocRef, { departmentHead: updatedHead });
      }

      // Update department staff
      const updatedStaff = (departmentData.departmentStaff || []).map(syncWithPreservation);
      await updateDoc(departmentDocRef, { departmentStaff: updatedStaff });
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

const removeUserFromDepartment = async (user) => {
  const departmentDocRef = doc(db, "college_faculty_staff", departmentId);

  try {
    const confirm = window.confirm(`Are you sure you want to remove ${user.name || "this user"}?`);
    if (!confirm) return;

    // Fetch the Department document
    const departmentDoc = await getDoc(departmentDocRef);
    if (!departmentDoc.exists()) {
      alert("Department document not found.");
      return;
    }

    const departmentData = departmentDoc.data();

    // Determine where to remove the user
    if (departmentData.departmentHead?.id === user.id) {
      // Remove department head
      await updateDoc(departmentDocRef, { departmentHead: null });
    } else if (departmentData.departmentStaff?.some((staff) => staff.id === user.id)) {
      // Remove user from departmentStaff
      const updatedStaff = departmentData.departmentStaff.filter((staff) => staff.id !== user.id);
      await updateDoc(departmentDocRef, { departmentStaff: updatedStaff });
    } else {
      alert("User not found in the department.");
      return;
    }

    alert(`${user.name || "User"} has been removed from the department.`);
  } catch (error) {
    console.error("Error removing user from the department:", error);
    alert("Failed to remove the user. Please try again.");
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
  if (!selectedUser.value.id || !departmentId) {
    alert("Please select a user and ensure the department is valid.");
    return;
  }

  const userDocRef = doc(db, "users", selectedUser.value.id);
  const departmentDocRef = doc(db, "college_faculty_staff", departmentId);

  try {
    // Fetch the user's data for synchronization
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      alert("Selected user does not exist in the database.");
      return;
    }

    const userData = userDoc.data();

    // Create a new member object with department-specific fields
    const newMember = {
      id: selectedUser.value.id,
      name: `${userData.firstName || "No"} ${userData.lastName || "Name Assigned"}`.trim(),
      designation: selectedUser.value.designation, // Department-specific designation
      photo: userData.photo || "/placeholder.png",
      email: userData.email || "N/A",
      specialization: userData.specialization || "N/A",
      status: "active",
    };

    // Add the user to the appropriate section in the department
    if (selectedUser.value.designation === "Department Head") {
      await updateDoc(departmentDocRef, { departmentHead: newMember });
    } else {
      await updateDoc(departmentDocRef, {
        departmentStaff: arrayUnion(newMember),
      });
    }

    // Synchronize non-designation fields to ensure consistency
    await updateDoc(userDocRef, {
      departmentId, // Optional: Track which department the user belongs to
      status: "active", // Update status if necessary
    });

    resetModal();
    alert("Faculty/Staff successfully added!");
  } catch (error) {
    console.error("Error adding Faculty/Staff:", error);
    alert("Failed to add Faculty/Staff. Please try again.");
  }
};

// Hide dropdown
const hideDropdown = () => {
  dropdownVisible.value = false;
};

// Fetch user data and set up real-time listeners on page load
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

