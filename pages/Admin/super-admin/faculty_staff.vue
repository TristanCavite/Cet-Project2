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
        <ProfilePreviewModal
      v-if="showProfilePreviewModal"
      :profile="selectedProfile"
      :showDelete="true"
      @close="closeProfilePreviewModal"
      @remove="removeUserFromCollege"
    />

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
  getDoc,
  updateDoc,
  onSnapshot,
  arrayUnion,
} from "firebase/firestore";
import { collection } from "firebase/firestore";
import Search from "@/components/Icons/Search.vue";
import ProfilePreviewModal from '@/components/ProfilePreviewModal.vue';

definePageMeta({
  middleware: "auth",
  layout: "super-admin",
});

const db = getFirestore();

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

const designations = [
  "College Dean",
  "College Secretary",
  "Department Head",
  "Administrative Staff",
];

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
          name: matchedUser.fullName || entry.name,
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

    const updatedHeads = (collegeData.departmentHeads || []).map(syncUserData);
    const updatedStaff = (collegeData.adminStaff || []).map(syncUserData);

    await updateDoc(collegeDocRef, {
      departmentHeads: updatedHeads,
      adminStaff: updatedStaff,
    });
  });
};

const showProfilePreview = async (profile) => {
  const user = users.value.find(u => u.id === profile.id);

  if (user?.role === "Head Admin" && user.departmentId) {
    try {
      const deptSnap = await getDoc(doc(db, "departments", user.departmentId));
      if (deptSnap.exists()) {
        selectedProfile.value = {
          ...profile,
          role: user.role,
          departmentName: deptSnap.data().name || '',
        };
      } else {
        selectedProfile.value = profile;
      }
    } catch (err) {
      console.error("Error fetching department name:", err);
      selectedProfile.value = profile;
    }
  } else {
    selectedProfile.value = profile;
  }

  showProfilePreviewModal.value = true;
};

const closeProfilePreviewModal = () => {
  showProfilePreviewModal.value = false;
  selectedProfile.value = null;
};

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
};

const filterUsers = () => {
  const query = searchQuery.value.toLowerCase();
  filteredUsers.value = users.value.filter((user) =>
    user.name.toLowerCase().includes(query)
  );
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
    name: userData.fullName || "Unnamed",
    designation: selectedUser.value.designation,
    photo: userData.photo || "/placeholder.png",
    email: userData.email || "N/A",
    specialization: userData.specialization || "N/A",
    status: "active",
  };

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

  // ✅ Flag user with college-wide reference
  await updateDoc(userDocRef, {
    status: "active",
    collegeWide: true,
  });

  resetModal();
};

const hideDropdown = () => {
  dropdownVisible.value = false;
};

onMounted(() => {
  const usersCollection = collection(db, "users");
  onSnapshot(usersCollection, (snapshot) => {
    users.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      name: doc.data().fullName || "Unnamed",
    }))
    .filter((user) => user.role !== "Super Admin");
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

