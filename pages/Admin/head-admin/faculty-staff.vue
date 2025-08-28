<template>
  <div class="p-8">
    <h1 class="mb-6 text-2xl font-bold text-maroon">Department Faculty and Staff</h1>

    <!-- Add Faculty/Staff Button -->
    <button
      @click="showAddModal = true"
      class="rounded bg-maroon px-4 py-2 text-white shadow hover:bg-red-600"
    >
      + Add Faculty and Staff
    </button>

    <!-- Department Head Section -->
    <div class="mt-8" v-if="departmentHead">
      <h2 class="mb-4 text-center text-xl font-semibold">Department Head</h2>
      <div class="flex justify-center">
        <div class="cursor-pointer text-center" @click="showProfilePreview(departmentHead)">
          <img
            :src="departmentHead?.photo || '/placeholder.png'"
            alt="Department Head"
            class="mx-auto h-32 w-32 rounded-full object-cover shadow-lg"
          />
          <p class="mt-2 text-lg font-bold">
            {{ departmentHead ? departmentHead.name : "No Head Assigned" }}
          </p>
        </div>
      </div>
    </div>

    <!-- Staff Section -->
    <div class="mt-12" v-if="departmentStaff.length">
      <h2 class="mb-4 text-center text-xl font-semibold">Staff</h2>
      <div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="staff in departmentStaff"
          :key="staff.id"
          class="cursor-pointer text-center"
          @click="showProfilePreview(staff)"
        >
          <img
            :src="staff.photo || '/placeholder.png'"
            alt="Staff"
            class="mx-auto h-24 w-24 rounded-full object-cover shadow-lg"
          />
          <p class="mt-2 text-lg font-bold">
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

    <!-- Add Faculty/Staff Modal (componentized) -->
    <HeadFacultyModal
      :show="showAddModal"
      :department-id="departmentId"
      :users="users"
      :designations="designations"
      @close="showAddModal = false"
      @added="onMemberAdded"
    />
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
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import ProfilePreviewModal from "@/components/ProfilePreviewModal.vue";
import HeadFacultyModal from "@/components/HeadFacultyModal.vue";

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

/** Designations passed to the modal (override or edit here anytime) */
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

onMounted(async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;

  // Get current head admin's department
  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  departmentId.value = userSnap.data().departmentId || "";
  if (!departmentId.value) return;

  // Subscribe to department staff/head updates
  fetchDepartmentFacultyAndStaff();

  // Subscribe to all users (exclude Super Admins)
  const usersRef = collection(db, "users");
  onSnapshot(usersRef, (snap) => {
    users.value = snap.docs
      .map((d) => ({
        id: d.id,
        ...d.data(),
        name: d.data().fullName || "Unnamed",
      }))
      .filter((u) => u.role !== "Super Admin");
  });
});

function fetchDepartmentFacultyAndStaff() {
  const depRef = doc(db, "departments", departmentId.value);
  onSnapshot(depRef, (snap) => {
    if (!snap.exists()) return;
    const data = snap.data();
    departmentHead.value = data.headAdmin || null;
    departmentStaff.value = data.staff || [];
  });
}

async function removeUserFromDepartment(user) {
  const depRef = doc(db, "departments", departmentId.value);
  const depSnap = await getDoc(depRef);
  if (!depSnap.exists()) return;

  const data = depSnap.data();
  const updates = {};

  if (data.headAdmin?.id === user.id) {
    updates.headAdmin = null;
  } else {
    updates.staff = (data.staff || []).filter((s) => s.id !== user.id);
  }

  await updateDoc(depRef, updates);

  // Remove department from user's departments array
  const userRef = doc(db, "users", user.id);
  await updateDoc(userRef, {
    departments: arrayRemove(departmentId.value),
  });

  alert(`${user.name} has been removed from the department.`);
}

async function showProfilePreview(profile) {
  const user = users.value.find((u) => u.id === profile.id);

  if (user?.role === "Head Admin" && user.departmentId) {
    try {
      const deptSnap = await getDoc(doc(db, "departments", user.departmentId));
      if (deptSnap.exists()) {
        selectedProfile.value = {
          ...profile,
          role: user.role,
          departmentName: deptSnap.data().name || "",
        };
      } else {
        selectedProfile.value = profile;
      }
    } catch (e) {
      console.error("Error fetching department name:", e);
      selectedProfile.value = profile;
    }
  } else {
    selectedProfile.value = profile;
  }

  showProfilePreviewModal.value = true;
}

function closeProfilePreviewModal() {
  showProfilePreviewModal.value = false;
  selectedProfile.value = null;
}

/** Optional: run things after a member is added (snapshot will auto-refresh UI) */
function onMemberAdded() {
  showAddModal.value = false;
}
</script>

<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>
