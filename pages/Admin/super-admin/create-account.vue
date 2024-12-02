<template>
  <div
    class="flex min-h-screen items-center justify-center bg-cover bg-center"
    style="background-image: url(&quot;/CET%20Faculty.jpg&quot;)"
  >
    <div class="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <h2 class="mb-4 text-center text-xl font-semibold text-gray-800">Create Account</h2>
        <form @submit.prevent="submitForm">
          <!-- First Name -->
          <div class="mb-4">
            <label for="first_name" class="block text-sm font-medium text-gray-600"
              >First Name</label
            >
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

          <!-- Department (Conditional) -->
          <div v-if="isHeadDepartment" class="mb-4">
            <label for="department" class="block text-sm font-medium text-gray-600"
              >Department</label
            >
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
            <p v-if="errors.departmentId" class="mt-1 text-xs text-red-500">
              {{ errors.departmentId }}
            </p>
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
            <label for="confirm_password" class="block text-sm font-medium text-gray-600"
              >Confirm Password</label
            >
            <input
              v-model="form.confirmPassword"
              type="password"
              id="confirm_password"
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
              placeholder="Confirm Password"
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-xs text-red-500">
              {{ errors.confirmPassword }}
            </p>
          </div>

          <button
            type="submit"
            class="w-full rounded-md bg-red-800 py-2 text-white shadow-md transition hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-600"
          >
            Create Account
          </button>

          <button
  type="button"
  @click="navigateToDashboard"
  class="mt-4 w-full rounded-md bg-gray-500 py-2 text-white shadow-md transition hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-400"
>
  Cancel
</button>

        </form>
    </div>
  </div>
</template>

<script setup>
  import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
  import { doc, getFirestore, setDoc } from "firebase/firestore";
  import { ref } from "vue";
  import * as yup from "yup";
  import { useRouter } from 'vue-router';

  definePageMeta({
    middleware: 'auth',
    layout: "no-navbar-footer", // Optional: use specific layout
  });
  // Departments list
  const departments = ref([
    { id: "dept1", name: "Agricultural and Biosystem Engineering" },
    { id: "dept2", name: "Civil Engineering" },
    { id: "dept3", name: "Computer Science" },
    { id: "dept4", name: "Geodetic Engineering" },
    { id: "dept5", name: "Mechanical Engineering" },
    { id: "dept6", name: "Meteorology" },
  ]);

  const router = useRouter();

  const navigateToDashboard = () => {
  router.push('/admin/super-admin');
};


  // Form data and errors
  const form = ref({
    firstName: "",
    lastName: "",
    email: "",
    title: "Faculty Member",
    departmentId: "",
    password: "",
    confirmPassword: "",
  });
  const errors = ref({});
  const isHeadDepartment = ref(false);

  // Yup validation schema
  const schema = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    email: yup.string().email("A valid email is required").required("Email is required"),
    title: yup.string().required("Title is required"),
    departmentId: yup
      .string()
      .nullable()
      .when("title", (title, schema) => {
        if (title === "Chair/Head of Department") {
          return schema.required("Department is required for Head of Department");
        }
        return schema.nullable();
      }),

    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Handle title changes
  const handleTitleChange = () => {
    isHeadDepartment.value = form.value.title === "Chair/Head of Department";
  };

  // Form submission
  const submitForm = async () => {
    try {
      await schema.validate(form.value, { abortEarly: false });
      errors.value = {};

      // Firebase Authentication and Firestore
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.value.email,
        form.value.password
      );
      const user = userCredential.user;

      const db = getFirestore();
      await setDoc(doc(db, "users", user.uid), {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        email: form.value.email,
        title: form.value.title,
        departmentId: isHeadDepartment.value ? form.value.departmentId : null,
        role: isHeadDepartment.value ? "Head Admin" : "Faculty",
      });

      alert("Account created successfully!");
      form.value = {
        firstName: "",
        lastName: "",
        email: "",
        title: "Faculty Member",
        departmentId: "",
        password: "",
        confirmPassword: "",
      };
    } catch (err) {
      if (err.name === "ValidationError") {
        err.inner.forEach((e) => {
          errors.value[e.path] = e.message;
        });
      } else {
        console.error("Error:", err.message);
        alert("Error: " + err.message);
      }
    }
  };
</script>

<style scoped>
  .text-red-500 {
    color: red;
  }
</style>
