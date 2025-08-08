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
     <ProfilePreviewModal
      v-if="showProfilePreviewModal"
      :profile="selectedProfile"
      :showDelete="true"
      @close="closeProfilePreviewModal"
      @remove="removeUserFromDepartment"
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
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Search from "@/components/Icons/Search.vue";
import ProfilePreviewModal from '@/components/ProfilePreviewModal.vue';

definePageMeta({
  middleware: "auth",
  layout: "head-admin",
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

const designations = [
  "Instructor I", "Instructor II", "Instructor III",
  "Assistant Professor I", "Assistant Professor II", "Assistant Professor III", "Assistant Professor IV",
  "Associate Professor I", "Associate Professor II", "Associate Professor III", "Associate Professor IV", "Associate Professor V",
  "Professor I", "Professor II", "Professor III",
  "Part-time Instructor"
];

onMounted(async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  departmentId.value = userSnap.data().departmentId;
  if (!departmentId.value) return;

  fetchDepartmentFacultyAndStaff();
});

const fetchDepartmentFacultyAndStaff = () => {
  if (!departmentId.value) return;
  const depRef = doc(db, "departments", departmentId.value);
  onSnapshot(depRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data();
      departmentHead.value = data.headAdmin || null;
      departmentStaff.value = data.staff || [];
    }
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

const removeUserFromDepartment = async (user) => {
  const depRef = doc(db, "departments", departmentId.value);
  const depSnap = await getDoc(depRef);
  if (!depSnap.exists()) return;

  let updates = {};
  const data = depSnap.data();

  if (data.headAdmin?.id === user.id) {
    updates.headAdmin = null;
  } else {
    updates.staff = data.staff.filter((s) => s.id !== user.id);
  }

  await updateDoc(depRef, updates);

  // Remove department from user's departments array
  const userRef = doc(db, "users", user.id);
  await updateDoc(userRef, {
    departments: arrayRemove(departmentId.value)
  });

  alert(`${user.name} has been removed from the department.`);
};

const filterUsers = () => {
  const q = searchQuery.value.toLowerCase();
  filteredUsers.value = users.value.filter((u) => u.name.toLowerCase().includes(q));
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
  if (!selectedUser.value.id || !departmentId.value) {
    alert("Select a valid user.");
    return;
  }

  const userRef = doc(db, "users", selectedUser.value.id);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const userData = userSnap.data();
  const newMember = {
    id: selectedUser.value.id,
    name: userData.fullName || "Unnamed", 
    designation: selectedUser.value.designation,
    photo: userData.photo || "/placeholder.png",
    email: userData.email || "N/A",
    specialization: userData.specialization || "N/A",
    status: "active",
  };

  const depRef = doc(db, "departments", departmentId.value);
  if (selectedUser.value.designation === "Department Head") {
    await updateDoc(depRef, { headAdmin: newMember });
    await updateDoc(userRef, { departmentId: departmentId.value });
  } else {
    await updateDoc(depRef, { staff: arrayUnion(newMember) });
    await updateDoc(userRef, {
      departments: arrayUnion(departmentId.value),
      status: "active",
    });
  }

  resetModal();
  alert("Faculty/Staff added successfully!");
};

const hideDropdown = () => {
  dropdownVisible.value = false;
};

onMounted(() => {
  const usersRef = collection(db, "users");
  onSnapshot(usersRef, (snap) => {
    users.value = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      name: doc.data().fullName || "Unnamed",
    }))
    .filter((user) => user.role !== "Super Admin");
    filterUsers();
  });
});
</script>

<!-- Keep your template and styles unchanged -->




<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>

