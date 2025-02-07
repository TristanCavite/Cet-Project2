<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6 text-maroon">College Faculty and Staff</h1>

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
          <img :src="collegeDean.photo || '/placeholder.png'" alt="College Dean" class="w-32 h-32 rounded-full object-cover mx-auto shadow-lg" />
          <p class="mt-2 font-bold text-lg">{{ collegeDean.name || "No Dean Assigned" }}</p>
        </div>
      </div>
    </div>

    <!-- College Secretary Section -->
    <div class="mt-8" v-if="collegeSecretary">
      <h2 class="text-xl font-semibold text-center mb-4">College Secretary</h2>
      <div class="flex justify-center">
        <div class="text-center cursor-pointer" @click="showProfilePreview(collegeSecretary)">
          <img :src="collegeSecretary.photo || '/placeholder.png'" alt="College Secretary" class="w-32 h-32 rounded-full object-cover mx-auto shadow-lg" />
          <p class="mt-2 font-bold text-lg">{{ collegeSecretary.name || "No Secretary Assigned" }}</p>
        </div>
      </div>
    </div>

    <!-- Department Heads Section -->
    <div class="mt-12" v-if="departmentHeads.length">
      <h2 class="text-xl font-semibold text-center mb-4">Department Heads</h2>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="head in departmentHeads" :key="head.id" class="text-center cursor-pointer" @click="showProfilePreview(head)">
          <img :src="head.photo || '/placeholder.png'" alt="Department Head" class="w-24 h-24 rounded-full object-cover mx-auto shadow-lg" />
          <p class="mt-2 font-bold text-lg">{{ head.name || "No Head Assigned" }}</p>
        </div>
      </div>
    </div>

    <!-- Administrative Staff Section -->
    <div class="mt-12" v-if="adminStaff.length">
      <h2 class="text-xl font-semibold text-center mb-4">Administrative Staff</h2>
      <div class="grid grid-cols-4 gap-6">
        <div v-for="staff in adminStaff" :key="staff.id" class="text-center cursor-pointer" @click="showProfilePreview(staff)">
          <img :src="staff.photo || '/placeholder.png'" alt="Staff" class="w-24 h-24 rounded-full object-cover mx-auto shadow-lg" />
          <p class="mt-2 font-bold text-lg">{{ staff.name || "No Staff Assigned" }}</p>
          <p class="text-sm text-gray-600">{{ staff.subDesignation || "N/A" }}</p>
        </div>
      </div>
    </div>

    <!-- Profile Preview Modal -->
    <div v-if="showProfilePreviewModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-3xl">
        <div class="text-center relative">
          <img :src="selectedProfile?.photo || '/placeholder.png'" alt="Profile Picture" class="w-32 h-32 rounded-full object-cover mx-auto shadow-lg" />
          <h2 class="mt-4 text-2xl font-bold text-maroon">{{ selectedProfile?.name || "No Name Provided" }}</h2>
          <p class="text-gray-500 text-lg font-semibold">{{ selectedProfile?.designation || "No Designation" }}</p>
          <div class="absolute top-0 right-0 cursor-pointer text-red-500 hover:text-red-700" @click="removeUserFromCollege(selectedProfile)">
            <Trash class="w-6 h-6" />
          </div>
        </div>
        <div class="mt-6 space-y-4 text-lg">
          <div>
            <p class="font-semibold text-maroon">Specialization:</p>
            <p>{{ selectedProfile?.specialization || "N/A" }}</p>
          </div>
          <div>
            <p class="font-semibold text-maroon">Email:</p>
            <p>{{ selectedProfile?.email || "N/A" }}</p>
          </div>
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
        <div class="mt-6 text-center">
          <button class="bg-maroon text-white px-6 py-2 rounded-lg shadow hover:bg-red-700" @click="closeProfilePreviewModal">Close</button>
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
          <ul v-if="dropdownVisible && filteredUsers.length" class="absolute w-full bg-white border rounded shadow mt-1 z-10">
            <li
              v-for="user in filteredUsers"
              :key="user.id"
              :class="{
                'bg-yellow-100': user.status === 'inactive',
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
            <option v-for="designation in designations" :key="designation" :value="designation">
              {{ designation }}
            </option>
          </select>
        </div>
        
        <!-- Sub-Designation Input (Only for Administrative Staff) -->
    <div v-if="selectedUser.designation === 'Administrative Staff'" class="mb-4">
      <label class="block text-sm font-medium">Specify Role:</label>
      <input v-model="selectedUser.subDesignation" type="text" placeholder="Please specify role" class="w-full border rounded px-3 py-2" />
    </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="resetModal" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
          <button @click="addFacultyOrStaff" class="px-4 py-2 bg-maroon text-white rounded hover:bg-red-600">Add</button>
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
  middleware: "auth",
  layout: "super-admin",
});

const db = getFirestore();
const auth = getAuth();
const collegeDean = ref(null);
const collegeSecretary = ref(null);
const departmentHeads = ref([]);
const adminStaff = ref([]);
const showAddModal = ref(false);
const showProfilePreviewModal = ref(false);
const selectedProfile = ref(null);
const users = ref([]);
const filteredUsers = ref([]);
const searchQuery = ref("");
const selectedUser = ref({});
const dropdownVisible = ref(false);

// Designations specific to the Super Admin
const designations = [
  "College Dean",
  "College Secretary",
  "Department Head",
  "Administrative Staff",
];

// Fetch the College-Wide document (real-time)
const fetchCollegeFacultyStaff = () => {
  const docRef = doc(db, "college_faculty_staff", "college-wide");
  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      collegeDean.value = data.collegeDean || null;
      collegeSecretary.value = data.collegeSecretary || null;
      departmentHeads.value = data.departmentHeads || [];
      adminStaff.value = data.adminStaff || [];
    }
  });
};

// Synchronize changes from `users` to `college_faculty_staff` (except designation)
const syncUserChangesToCollege = () => {
  const usersCollection = collection(db, "users");
  onSnapshot(usersCollection, async (snapshot) => {
    const updatedUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const collegeDocRef = doc(db, "college_faculty_staff", "college-wide");
    const collegeDoc = await getDoc(collegeDocRef);
    if (!collegeDoc.exists()) return;

    const collegeData = collegeDoc.data();

    const syncUserData = (entry) => {
      const matchedUser = updatedUsers.find((user) => user.id === entry.id);
      if (matchedUser) {
        return {
          ...entry,
          name: `${matchedUser.firstName} ${matchedUser.lastName}`.trim(),
          photo: matchedUser.photo || entry.photo,
          email: matchedUser.email || entry.email,
          specialization: matchedUser.specialization || entry.specialization,
          education: matchedUser.education || entry.education,
          websites: matchedUser.websites || entry.websites,
          status: matchedUser.status,
        };
      }
      return entry;
    };

    if (collegeData.collegeDean?.id) {
      const updatedDean = syncUserData(collegeData.collegeDean);
      await updateDoc(collegeDocRef, { collegeDean: updatedDean });
    }

    if (collegeData.collegeSecretary?.id) {
      const updatedSecretary = syncUserData(collegeData.collegeSecretary);
      await updateDoc(collegeDocRef, { collegeSecretary: updatedSecretary });
    }

    const updatedDepartmentHeads = (collegeData.departmentHeads || []).map(syncUserData);
    await updateDoc(collegeDocRef, { departmentHeads: updatedDepartmentHeads });

    const updatedAdminStaff = (collegeData.adminStaff || []).map(syncUserData);
    await updateDoc(collegeDocRef, { adminStaff: updatedAdminStaff });
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

// Remove user from College-Wide document
const removeUserFromCollege = async (user) => {
  const collegeDocRef = doc(db, "college_faculty_staff", "college-wide");
  const collegeDoc = await getDoc(collegeDocRef);
  if (!collegeDoc.exists()) return;

  const collegeData = collegeDoc.data();
  let updates = {};

  if (collegeData.collegeDean?.id === user.id) {
    updates.collegeDean = null;
  } else if (collegeData.collegeSecretary?.id === user.id) {
    updates.collegeSecretary = null;
  } else if (collegeData.departmentHeads?.some((head) => head.id === user.id)) {
    updates.departmentHeads = collegeData.departmentHeads.filter((head) => head.id !== user.id);
  } else if (collegeData.adminStaff?.some((staff) => staff.id === user.id)) {
    updates.adminStaff = collegeData.adminStaff.filter((staff) => staff.id !== user.id);
  }

  await updateDoc(collegeDocRef, updates);
  alert(`${user.name} has been removed from College-Wide.`);
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
  if (!selectedUser.value.id) {
    alert("Please select a valid user.");
    return;
  }

  const userDocRef = doc(db, "users", selectedUser.value.id);
  const collegeDocRef = doc(db, "college_faculty_staff", "college-wide");
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) return;

  const userData = userDoc.data();
  const newStaff = {
    id: selectedUser.value.id,
    name: `${userData.firstName} ${userData.lastName}`.trim(),
    designation: selectedUser.value.designation,
    photo: userData.photo || "/placeholder.png",
    email: userData.email || "N/A",
    specialization: userData.specialization || "N/A",
    status: "active",
  };

  // ✅ If the user is an Administrative Staff, store the sub-designation
  if (selectedUser.value.designation === "Administrative Staff") {
    newStaff.subDesignation = selectedUser.value.subDesignation || "N/A";
  }

  if (selectedUser.value.designation === "College Dean") {
    await updateDoc(collegeDocRef, { collegeDean: newStaff });
  } else if (selectedUser.value.designation === "College Secretary") {
    await updateDoc(collegeDocRef, { collegeSecretary: newStaff });
  } else if (selectedUser.value.designation === "Department Head") {
    await updateDoc(collegeDocRef, { departmentHeads: arrayUnion(newStaff) });
  } else if (selectedUser.value.designation === "Administrative Staff") {
    await updateDoc(collegeDocRef, { adminStaff: arrayUnion(newStaff) });
  }

  await updateDoc(userDocRef, { status: "active" });

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

  fetchCollegeFacultyStaff();
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


<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>
