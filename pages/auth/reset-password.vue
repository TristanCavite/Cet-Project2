<template>
  <!-- Same centered layout + background as login.vue -->
  <div
    class="flex items-center justify-center h-screen bg-center bg-cover"
    style="background-image: url('bg.png')"
  >
    <!-- Card -->
    <div class="w-full max-w-md p-6 bg-white border border-gray-300 rounded shadow-md">
      <!-- Brand -->
      <div class="flex flex-col items-center my-4 space-y-2">
        <img src="/logoTab.png" alt="Logo" class="h-14" />
        <h1 class="text-2xl font-semibold tracking-tight">Reset your password</h1>
      </div>

      <!-- Subtext -->
      <p class="mb-6 text-center text-gray-500" v-if="email">
        for <span class="font-semibold text-gray-800">{{ email }}</span>
      </p>
      <p class="mb-6 text-center text-gray-500" v-else>Checking your reset link…</p>

      <!-- Loading -->
      <div v-if="stage === 'loading'" class="py-8 flex justify-center">
        <svg class="animate-spin h-6 w-6 text-red-800" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
        </svg>
      </div>

      <!-- Error state -->
      <div v-else-if="stage === 'error'">
        <div class="rounded border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
          {{ errorMsg || 'This password reset link is invalid or has expired.' }}
        </div>
        <button
          class="w-full mt-4 rounded-md bg-red-800 py-2 text-white font-semibold shadow-md transition hover:bg-red-700"
          @click="goLogin"
        >
          Back to Log in
        </button>
      </div>

      <!-- Form -->
      <form v-else-if="stage === 'form'" @submit.prevent="confirmReset" class="grid gap-4">
        <!-- New password -->
        <div>
          <label class="block text-sm font-medium text-gray-600">New password</label>
          <div class="relative mt-1">
            <input
              :type="show1 ? 'text' : 'password'"
              v-model="password"
              autocomplete="new-password"
              class="w-full rounded-md border border-gray-300 px-3 py-2 pr-12 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              @click="show1 = !show1"
            >{{ show1 ? 'Hide' : 'Show' }}</button>
          </div>
        </div>

        <!-- Confirm -->
        <div>
          <label class="block text-sm font-medium text-gray-600">Confirm password</label>
          <div class="relative mt-1">
            <input
              :type="show2 ? 'text' : 'password'"
              v-model="confirm"
              autocomplete="new-password"
              class="w-full rounded-md border border-gray-300 px-3 py-2 pr-12 shadow-sm focus:outline-none focus:ring focus:ring-red-600"
              placeholder="Re-enter password"
            />
            <button
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
              @click="show2 = !show2"
            >{{ show2 ? 'Hide' : 'Show' }}</button>
          </div>
        </div>

        <!-- Tips / errors -->
        <p class="text-xs text-gray-500 -mt-1">Use 8+ characters. A mix of upper/lowercase and numbers is recommended.</p>
        <p v-if="formError" class="text-sm text-red-600 -mt-1">{{ formError }}</p>

        <!-- Actions -->
        <div class="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            class="rounded-md bg-gray-300 px-4 py-2 text-gray-800 font-semibold shadow-sm hover:bg-gray-400"
            @click="goLogin"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="rounded-md bg-red-800 px-4 py-2 text-white font-semibold shadow-md hover:bg-red-700 disabled:opacity-60"
          >
            <span v-if="!loading">Save</span>
            <span v-else>Saving…</span>
          </button>
        </div>
      </form>

      <!-- Done -->
      <div v-else-if="stage === 'done'">
        <div class="rounded border border-green-200 bg-green-50 p-3 text-green-800 text-sm">
          Your password has been updated. You can now log in with your new password.
        </div>
        <button
          class="w-full mt-4 rounded-md bg-red-800 py-2 text-white font-semibold shadow-md transition hover:bg-red-700"
          @click="goLogin"
        >
          Back to Log in
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// Clean JS (no TS). Styled to match your login card.

import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAuth, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth'

const route = useRoute()
const router = useRouter()
const auth = getAuth()

// Query params from the email link
const mode = computed(() => String(route.query.mode || ''))
const oobCode = computed(() => String(route.query.oobCode || ''))

// UI state
const stage = ref('loading') // 'loading' | 'form' | 'done' | 'error'
const email = ref('')
const errorMsg = ref('')
const password = ref('')
const confirm = ref('')
const formError = ref('')
const loading = ref(false)
const show1 = ref(false)
const show2 = ref(false)

function goLogin() {
  router.push('/login')
}

function validate() {
  if ((password.value || '').length < 8) return 'Password must be at least 8 characters.'
  if (password.value !== confirm.value) return 'Passwords do not match.'
  return ''
}

onMounted(async () => {
  // Guard invalid links quickly
  if (mode.value !== 'resetPassword' || !oobCode.value) {
    stage.value = 'error'
    errorMsg.value = 'Invalid reset link.'
    return
  }

  try {
    // Verify the code and fetch the email to display (builds user trust)
    email.value = await verifyPasswordResetCode(auth, oobCode.value)
    stage.value = 'form'
  } catch (e) {
    stage.value = 'error'
    errorMsg.value = 'This reset link is invalid or has expired.'
  }
})

async function confirmReset() {
  formError.value = validate()
  if (formError.value) return

  loading.value = true
  try {
    await confirmPasswordReset(auth, oobCode.value, password.value)
    stage.value = 'done'
  } catch (e) {
    formError.value = 'Failed to update password. Please request a new link and try again.'
  } finally {
    loading.value = false
  }
}
</script>
