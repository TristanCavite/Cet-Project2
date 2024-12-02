<template>
  <div
    class="flex items-center justify-center h-screen bg-center bg-cover"
    style="background-image: url('bg.png')"
  >
    <!-- Wrapper with Border -->
    <div class="w-full max-w-md p-6 bg-white border border-gray-300 rounded shadow-md">
      <!-- Centered Logo and Heading -->
      <div class="flex flex-col items-center my-6 space-y-2">
        <img src="/logoTab.png" alt="Logo" class="h-14" />
        <h1 class="text-2xl font-semibold tracking-tight">Log in</h1>
      </div>

      <p class="mb-8 text-center text-gray-500">Enter your email & password to log in.</p>

      <!-- Form -->
      <form @submit.prevent="submit">
        <fieldset class="grid gap-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-600">Email</label>
            <input
              v-model="email"
              type="email"
              id="email"
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
              placeholder="sample.rani@valid.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-600">Password</label>
            <input
              v-model="password"
              type="password"
              id="password"
              class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
              placeholder="******"
            />
          </div>

          <div class="flex items-center justify-between mt-2">
            <label class="flex items-center">
              <input type="checkbox" class="rounded border-gray-300 text-red-600 focus:ring-red-600" />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" class="text-sm font-medium underline text-red-600">Forgot password?</a>
          </div>

          <button
            type="submit"
            class="w-full mt-4 rounded-md bg-red-800 py-2 text-white font-semibold shadow-md transition hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-600"
          >
            Log In
          </button>
          <button
            type="button"
            @click="cancel"
            class="w-full mt-2 rounded-md bg-gray-300 py-2 text-gray-800 font-semibold shadow-md transition hover:bg-gray-400 focus:outline-none focus:ring focus:ring-gray-600"
          >
            Cancel
          </button>
        </fieldset>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

definePageMeta({
  layout:"no-navbar-footer"
})

const email = ref('');
const password = ref('');
const auth = getAuth();
const db = getFirestore();
const router = useRouter();

const submit = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value.trim(), password.value.trim());
    const user = userCredential.user;

    console.log('Logged in successfully:', user);

    // Check Firestore for user document
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Automatically create a user document if not found
      console.log('No user document found. Creating one...');
      await setDoc(userDocRef, {
        email: user.email,
        role: 'Faculty', // Default role (adjust as needed)
        departmentId: null,
      });
      console.log('User document created successfully.');
    }

    const role = userDoc.data()?.role || 'Faculty';

    // Redirect based on role
    if (role === 'Super Admin') {
      router.push('/admin/super-admin');
    } else if (role === 'Head Admin') {
      router.push('/admin/head-admin');
    } else if (role === 'Faculty') {
      router.push('/admin/faculty');
    } else {
      console.error('Unknown role:', role);
      alert('User role is not recognized.');
    }
  } catch (error) {
    console.error('Login failed:', error.message);
    alert('Invalid email or password.');
  }
};

const cancel = () => {
  navigateTo("/", { replace: true }); // Redirect to the homepage or any desired page
};

</script>

