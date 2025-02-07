<template>
  <div
    class="flex min-h-screen items-center justify-center bg-cover bg-center"
    style="background-image: url('/CET%20Faculty.jpg')"
  >
    <div class="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h2 class="mb-4 text-center text-xl font-semibold text-gray-800">Create Account</h2>
      <form @submit.prevent="submitForm">
        <!-- First Name -->
        <div class="mb-4">
          <label for="first_name" class="block text-sm font-medium text-gray-600">First Name</label>
          <input
            v-model="form.firstName"
            type="text"
            id="first_name"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
            placeholder="First Name"
          />
          <p v-if="errors.firstName" class="mt-1 text-xs text-red-500">{{ errors.firstName }}</p>
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label for="last_name" class="block text-sm font-medium text-gray-600">Last Name</label>
          <input
            v-model="form.lastName"
            type="text"
            id="last_name"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
            placeholder="Last Name"
          />
          <p v-if="errors.lastName" class="mt-1 text-xs text-red-500">{{ errors.lastName }}</p>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
          <input
            v-model="form.email"
            type="email"
            id="email"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
            placeholder="Email"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>

        <!-- Title -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-600">Title</label>
          <select
            v-model="form.title"
            id="title"
            @change="handleTitleChange"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
          >
            <option value="Faculty Member">Faculty Member</option>
            <option value="Chair/Head of Department">Chair/Head of Department</option>
          </select>
          <p v-if="errors.title" class="mt-1 text-xs text-red-500">{{ errors.title }}</p>
        </div>

        <!-- Department (Only if user is Head of Department) -->
        <div v-if="isHeadDepartment" class="mb-4">
          <label for="department" class="block text-sm font-medium text-gray-600">Department</label>
          <select
            v-model="form.departmentId"
            id="department"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
          >
            <option value="">Select Department</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
          <p v-if="errors.departmentId" class="mt-1 text-xs text-red-500">{{ errors.departmentId }}</p>
        </div>

        <!-- Password -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
            placeholder="Password"
          />
          <p v-if="errors.password" class="mt-1 text-xs text-red-500">{{ errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div class="mb-4">
          <label for="confirm_password" class="block text-sm font-medium text-gray-600">Confirm Password</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            id="confirm_password"
            class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
            placeholder="Confirm Password"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500">{{ errors.confirmPassword }}</p>
        </div>

        <button
          type="submit"
          class="w-full rounded-md bg-red-800 py-2 text-white shadow-md transition hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-600"
        >
          Create Account
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, getFirestore, setDoc, updateDoc, getDocs, collection } from "firebase/firestore";

// Firestore
const db = getFirestore();
const departments = ref([]);
const form = ref({
  firstName: "",
  lastName: "",
  email: "",
  title: "Faculty Member",
  departmentId: "",
  password: "",
  confirmPassword: "",
  photo: "", // Add profile picture later
});
const errors = ref({});
const isHeadDepartment = ref(false);

// Fetch departments from Firestore
const fetchDepartments = async () => {
  const departmentsCollection = collection(db, "departments");
  const snapshot = await getDocs(departmentsCollection);
  departments.value = snapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));
};

// Handle title changes
const handleTitleChange = () => {
  isHeadDepartment.value = form.value.title === "Chair/Head of Department";
};

// Form Submission
const submitForm = async () => {
  try {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, form.value.email, form.value.password);
    const user = userCredential.user;

    // Save User in 'users' collection
    await setDoc(doc(db, "users", user.uid), {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      role: isHeadDepartment.value ? "Head Admin" : "Faculty",
      departmentId: isHeadDepartment.value ? form.value.departmentId : null,
      status: "active",
      photo: form.value.photo || "", // Placeholder for profile picture
    });

    // Assign Head Admin to department's "headAdmin" map
    if (isHeadDepartment.value) {
      const departmentRef = doc(db, "departments", form.value.departmentId);
      await updateDoc(departmentRef, {
        headAdmin: {
          id: user.uid,
          name: `${form.value.firstName} ${form.value.lastName}`,
          email: form.value.email,
          designation: "Head Admin",
          photo: form.value.photo || "",
          status: "active",
        },
      });
    }

    alert("Account created successfully!");
  } catch (err) {
    console.error("Error:", err.message);
    alert("Error: " + err.message);
  }
};

onMounted(fetchDepartments);
</script>

<style scoped>
.text-red-500 {
  color: red;
}
</style>
