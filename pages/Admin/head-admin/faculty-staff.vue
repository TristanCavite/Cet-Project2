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
            {{ departmentHead ? departmentHead.name : "No Head Assigned" }}
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
            {{ staff ? staff.name : "No Staff Assigned" }}
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
import { ref, onMounted } from "vue";
import {
  getFirestore,
  doc,
  collection,
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Search from "@/components/Icons/Search.vue";
import Trash from "@/components/Icons/trash.vue";

definePageMeta({
  middleware: "auth", // Protect the page
  layout: "head-admin", // Use head-admin layout
});

const db = getFirestore();
const auth = getAuth();
const departmentId = ref("");
const departmentHead = ref(null);
const departmentStaff = ref([]);
const showAddModal = ref(false);
const showProfilePreviewModal = ref(false);
const selectedProfile = ref(null);
const users = ref([]);
const filteredUsers = ref([]);
const searchQuery = ref("");
const selectedUser = ref({});
const dropdownVisible = ref(false);

// Designations specific to this department
const designations = [
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

// Fetch department ID and set up listeners
onMounted(async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No user is currently logged in.");
    return;
  }

  const userDocRef = doc(db, "users", currentUser.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    departmentId.value = userDoc.data().departmentId;
    if (!departmentId.value) {
      console.error("Department ID is missing in the user document.");
      return;
    }

    fetchDepartmentFacultyAndStaff();
    syncUserUpdates();
  } else {
    console.error("User document not found in Firestore.");
  }
});

// Fetch department's faculty and staff (real-time)
const fetchDepartmentFacultyAndStaff = () => {
  if (!departmentId.value) return;

  const departmentDocRef = doc(db, "departments", departmentId.value);
  onSnapshot(departmentDocRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      departmentHead.value = data.headAdmin || null;
      departmentStaff.value = data.staff || [];
    }
  });
};

// Synchronize changes from `users` to department fields (except designation)
const syncUserUpdates = () => {
  const usersCollection = collection(db, "users");
  onSnapshot(usersCollection, async (snapshot) => {
    const updatedUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const departmentDocRef = doc(db, "departments", departmentId.value);
    const departmentDoc = await getDoc(departmentDocRef);
    if (!departmentDoc.exists()) return;

    const departmentData = departmentDoc.data();

    const syncUserData = (entry) => {
      const matchedUser = updatedUsers.find((user) => user.id === entry.id);
      if (matchedUser) {
        return {
          ...entry,
          name: `${matchedUser.firstName} ${matchedUser.lastName}`.trim(),
          photo: matchedUser.photo || entry.photo,
          email: matchedUser.email || entry.email,
          specialization: matchedUser.specialization || entry.specialization,
          education: matchedUser.education || entry.education,  // ✅ Syncs education field
          websites: matchedUser.websites || entry.websites,      // ✅ Syncs websites field
          status: matchedUser.status,
        };
      }
      return entry;
    };

    if (departmentData.headAdmin?.id) {
      const updatedHead = syncUserData(departmentData.headAdmin);
      await updateDoc(departmentDocRef, { headAdmin: updatedHead });
    }

    const updatedStaff = (departmentData.staff || []).map(syncUserData);
    await updateDoc(departmentDocRef, { staff: updatedStaff });
  });
};

// Show profile preview modal
const showProfilePreview = (profile) => {
  selectedProfile.value = profile;
  showProfilePreviewModal.value = true;
};

// Close profile preview modal
const closeProfilePreviewModal = () => {
  showProfilePreviewModal.value = false;
  selectedProfile.value = null;
};

// Remove user from department (head or staff)
const removeUserFromDepartment = async (user) => {
  const departmentDocRef = doc(db, "departments", departmentId.value);
  const departmentDoc = await getDoc(departmentDocRef);
  if (!departmentDoc.exists()) return;

  const departmentData = departmentDoc.data();
  let updates = {};

  if (departmentData.headAdmin?.id === user.id) {
    updates.headAdmin = null;
  } else {
    updates.staff = departmentData.staff.filter((staff) => staff.id !== user.id);
  }

  await updateDoc(departmentDocRef, updates);
  alert(`${user.name} has been removed from the department.`);
};

// Search users
const filterUsers = () => {
  const query = searchQuery.value.toLowerCase();
  filteredUsers.value = users.value.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
};

// Select user from search results
const selectUser = (user) => {
  selectedUser.value = { ...user };
  searchQuery.value = user.name;
  filteredUsers.value = [];
};

// Reset modal
const resetModal = () => {
  selectedUser.value = {};
  searchQuery.value = "";
  showAddModal.value = false;
};

// Add faculty or staff
const addFacultyOrStaff = async () => {
  if (!selectedUser.value.id || !departmentId.value) {
    alert("Please select a valid user.");
    return;
  }

  const userDocRef = doc(db, "users", selectedUser.value.id);
  const departmentDocRef = doc(db, "departments", departmentId.value);
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) return;

  const userData = userDoc.data();
  const newMember = {
    id: selectedUser.value.id,
    name: `${userData.firstName} ${userData.lastName}`.trim(),
    designation: selectedUser.value.designation,
    photo: userData.photo || "/placeholder.png",
    email: userData.email || "N/A",
    specialization: userData.specialization || "N/A",
    status: "active",
  };

  if (selectedUser.value.designation === "Department Head") {
    await updateDoc(departmentDocRef, { headAdmin: newMember });
  } else {
    await updateDoc(departmentDocRef, { staff: arrayUnion(newMember) });
  }

  await updateDoc(userDocRef, { departmentId: departmentId.value, status: "active" });

  resetModal();
  alert("Faculty/Staff added successfully!");
};

// Hide search dropdown
const hideDropdown = () => {
  dropdownVisible.value = false;
};

// Fetch users in real-time
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

