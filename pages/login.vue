<template>
  <!-- Page background layers -->
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden">
    <!-- Blurred photo -->
    <div
      class="absolute inset-0 -z-20 bg-center bg-cover scale-105 blur-xl"
      style="background-image: url('/bg.png')"
      aria-hidden="true"
    />
    <!-- Dark overlay to improve contrast -->
    <div class="absolute inset-0 -z-10 bg-black/70" aria-hidden="true" />

    <!-- Glassy form box -->
   <div class="relative mx-4 w-full max-w-[480px] sm:max-w-[520px]">

      <div
        class="rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/15 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]"
      >
        <!-- Header -->
        <div class="flex flex-col items-center px-8 pt-8">
          <img src="/logoTab.png" alt="Logo" class="h-14" />
          <h1 class="mt-3 text-2xl font-semibold tracking-tight text-white">Log in</h1>
          <p class="mt-1 mb-6 text-center text-sm text-white/70">
            Enter your email & password to log in.
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="px-8 pb-8">
          <fieldset class="grid gap-4">
            <!-- EMAIL -->
            <div>
              <label for="email" class="block text-sm font-medium text-white/80">Email</label>
              <input
                v-model="email"
                type="email"
                id="email"
                autocomplete="email"
                required
                class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-white/40 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                placeholder="sample.rani@valid.com"
              />
            </div>

            <!-- PASSWORD -->
            <div>
              <div class="flex items-center justify-between">
                <label for="password" class="block text-sm font-medium text-white/80">Password</label>
                <button
                  type="button"
                  class="text-sm font-medium text-white/90 underline decoration-white/30 underline-offset-4 hover:decoration-white"
                  @click="forgotOpen = true"
                >
                  Forgot password?
                </button>
              </div>
              <input
                v-model="password"
                type="password"
                id="password"
                autocomplete="current-password"
                required
                class="mt-1 w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-white/40 shadow-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                placeholder="******"
              />
            </div>

            <!-- REMEMBER -->
            <label class="mt-1 inline-flex items-center gap-2">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="rounded border-white/30 bg-transparent text-red-600 focus:ring-red-600"
              />
              <span class="text-sm text-white/80">Remember me</span>
            </label>

            <!-- SUBMIT -->
            <button
              type="submit"
              :disabled="loading"
              class="mt-2 w-full rounded-lg bg-white py-2.5 font-semibold text-black shadow-lg transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span v-if="!loading">Log In</span>
              <span v-else>Signing in…</span>
            </button>

            <!-- CANCEL -->
            <button
              type="button"
              @click="cancel"
              class="w-full rounded-lg bg-white/10 py-2.5 font-semibold text-white shadow-sm transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/20"
            >
              Cancel
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  </div>

  <!-- Keep your existing modal exactly the same -->
  <ForgotPasswordModal
    v-model="forgotOpen"
    :prefill="email"
    redirect-path="/auth/reset-password"
    @sent="onResetSent"
  />
</template>


<script setup>
/**
 * Nuxt 3 + Firebase Auth + Firestore (JavaScript version)
 * - No TypeScript syntax here (avoids the errors you saw)
 * - No email verification required
 * - Remember me toggles auth persistence (local vs session)
 * - Ensures a user doc exists; routes by role
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Firebase Auth
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,   // persists after browser restart (Remember ON)
  browserSessionPersistence, // clears on tab close (Remember OFF)
} from 'firebase/auth'

// Firestore
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

definePageMeta({ layout: 'no-navbar-footer' })

// ----------------- STATE -----------------
const email = ref('')
const password = ref('')
const rememberMe = ref(true)
const loading = ref(false)
const forgotOpen = ref(false) // controls the modal

const auth = getAuth()
const db = getFirestore()
const router = useRouter()

// ----------------- ACTIONS -----------------
const submit = async () => {
  if (!email.value.trim() || !password.value.trim()) return

  loading.value = true
  try {
    // Apply persistence based on Remember me
    await setPersistence(
      auth,
      rememberMe.value ? browserLocalPersistence : browserSessionPersistence
    )

    // Sign in (no email verification checks)
    const cred = await signInWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value.trim()
    )
    const user = cred.user

    // Ensure a user document exists
    const userDocRef = doc(db, 'users', user.uid)
    let snap = await getDoc(userDocRef)

    if (!snap.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        role: 'Faculty',     // default role
        departmentId: null,
        status: 'active',    // default status
        createdAt: new Date(),
      })
      snap = await getDoc(userDocRef) // re-fetch newly created data
    }

    const data = snap.data() || {}
    const role = data.role || 'Faculty'
    const status = data.status || 'active'

    // Block inactive accounts except Super Admin
    if (role !== 'Super Admin' && status !== 'active') {
      alert('Your account is inactive. Please contact the administrator.')
      return
    }

    // Route by role
    if (role === 'Super Admin') router.push('/admin/super-admin')
    else if (role === 'Head Admin') router.push('/admin/head-admin')
    else if (role === 'Faculty') router.push('/admin/faculty')
    else {
      console.error('Unknown role:', role)
      alert('User role is not recognized.')
    }
  } catch (err) {
    // No TS cast; log safely for JS
    const msg = err && err.message ? err.message : String(err)
    console.error('Login failed:', msg)
    alert('Invalid email or password.')
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  router.push('/', { replace: true })
}

const onResetSent = (targetEmail) => {
  // Optional: toast/analytics hook
  // console.log('Password reset email attempted for:', targetEmail)
}
</script>
