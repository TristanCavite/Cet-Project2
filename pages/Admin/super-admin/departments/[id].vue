<template>
    <div class="p-8">
      <div class="flex justify-between items-center mb-6">
        <!-- Page Title -->
        <h1 class="text-2xl font-bold text-maroon">
          {{ departmentName }} - Degree Programs
        </h1>

        <!-- Edit Toggle Button -->
        <button
          @click="toggleEditMode"
          class="px-4 py-2 border rounded text-white flex items-center space-x-2"
          :class="editMode ? 'bg-red-500 hover:bg-red-600' : 'bg-maroon hover:bg-red-600'"
        >
          <Pen class="w-5 h-5" />
          <span>{{ editMode ? "Done" : "Edit" }}</span>
        </button>
      </div>

      <!-- Add Degree Program Button -->
      <button
        @click="showAddModal = true"
        class="bg-maroon text-white px-4 py-2 rounded mb-4 hover:bg-red-600"
      >
        + Add Degree Program
      </button>

      <!-- Degree Program List -->
      <div class="bg-white rounded shadow-md">
        <table class="table-auto w-full border-collapse text-left">
          <thead>
            <tr class="bg-gray-100 border-b">
              <th class="px-6 py-4">Program Name</th>
              <th v-if="editMode" class="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="program in degreePrograms" :key="program.id" class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 flex items-center">
                <!-- Editable Program Name -->
                <span
                  v-if="!program.editing"
                  class="cursor-pointer text-maroon hover:underline flex items-center"
                >
                  {{ program.name }}
                  <button v-if="editMode" @click="program.editing = true" class="ml-2 text-gray-500 hover:text-gray-700">
                    <Pen class="w-4 h-4" />
                  </button>
                </span>

                <!-- Input Field for Renaming -->
                <input
                  v-else
                  v-model="program.newName"
                  class="border rounded px-2 py-1 w-full"
                  @keyup.enter="updateProgramName(program)"
                  @blur="program.editing = false"
                />
              </td>

              <!-- Delete Button (Only in Edit Mode) -->
              <td v-if="editMode" class="px-6 py-4">
                <button
                  @click="confirmDelete(program.id)"
                  class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Program Modal -->
      <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow-lg w-96">
          <h2 class="text-lg font-bold mb-4">Add Degree Program</h2>
          <input v-model="newProgram" type="text" class="border rounded w-full px-3 py-2 mb-4" placeholder="Enter Program Name" />
          <div class="flex justify-end space-x-2">
            <button @click="showAddModal = false" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button @click="addDegreeProgram" class="px-4 py-2 bg-maroon text-white rounded hover:bg-red-600">Add</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import Pen from "@/components/Icons/Pen.vue"; // Import Pen icon

const db = getFirestore();
const route = useRoute();
const departmentId = route.params.id;
const departmentName = ref("");
const degreePrograms = ref([]);
const showAddModal = ref(false);
const newProgram = ref("");
const editMode = ref(false);

definePageMeta({
  middleware: "auth",
  layout: "super-admin",
});

// Fetch Department Name & Degree Programs
const fetchDegreePrograms = async () => {
  // Get department name
  const departmentRef = doc(db, "departments", departmentId);
  const departmentSnap = await getDoc(departmentRef);
  departmentName.value = departmentSnap.exists() ? departmentSnap.data().name : "Unknown Department";

  // Get degree programs
  const programsCollection = collection(db, "departments", departmentId, "degreePrograms");
  const programsSnapshot = await getDocs(programsCollection);
  degreePrograms.value = programsSnapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    editing: false,
    newName: doc.data().name,
  }));
};

// Add Degree Program
const addDegreeProgram = async () => {
  if (!newProgram.value.trim()) return;
  await addDoc(collection(db, "departments", departmentId, "degreePrograms"), { name: newProgram.value });
  newProgram.value = "";
  showAddModal.value = false;
  fetchDegreePrograms();
};

// Update Program Name
const updateProgramName = async (program) => {
  if (!program.newName.trim() || program.newName === program.name) {
    program.editing = false;
    return;
  }
  await updateDoc(doc(db, "departments", departmentId, "degreePrograms", program.id), { name: program.newName });
  program.name = program.newName;
  program.editing = false;
};

// Delete Program with Confirmation
const confirmDelete = async (programId) => {
  if (!window.confirm("Are you sure you want to delete this program?")) return;
  await deleteDoc(doc(db, "departments", departmentId, "degreePrograms", programId));
  fetchDegreePrograms();
};

// Toggle Edit Mode
const toggleEditMode = () => {
  editMode.value = !editMode.value;
};

// Fetch data on page load
onMounted(fetchDegreePrograms);
</script>

<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}
</style>
