<!-- components/ForgotPasswordModal.vue -->
<template>
  <!-- Overlay; click outside to close -->
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    @click.self="close()"
  >
    <!-- Card -->
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      <h2 :id="titleId" class="mb-2 text-xl font-semibold text-red-800">
        Reset your password
      </h2>
      <p class="mb-4 text-sm text-gray-600">
        Enter your email. If an account exists, we’ll send a password reset link.
      </p>

      <!-- Initial form -->
      <div v-if="!sent">
        <label class="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          ref="emailInputRef"
          v-model="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          class="w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-red-800"
        />
        <p v-if="errorMsg" class="mt-2 text-sm text-red-600">{{ errorMsg }}</p>

        <div class="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            class="rounded bg-gray-200 px-3 py-2 text-gray-800 hover:opacity-90 disabled:opacity-60"
            @click="close"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded bg-red-800 px-3 py-2 text-white hover:opacity-90 disabled:opacity-60"
            @click="sendReset"
            :disabled="loading"
          >
            <span v-if="!loading">Send reset link</span>
            <span v-else>Sending…</span>
          </button>
        </div>
      </div>

      <!-- Neutral success state -->
      <div v-else>
        <div class="rounded-md bg-green-50 p-4 text-green-800">
          If an account exists for <span class="font-medium">{{ email }}</span>,
          we’ve sent a password reset email. Check your inbox and spam folder.
        </div>
        <div class="mt-6 flex justify-end">
          <button
            type="button"
            class="rounded bg-red-800 px-3 py-2 text-white hover:opacity-90"
            @click="close"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ✅ Reusable modal that sends Firebase password-reset emails.
// ✅ No email verification required.
// ✅ v-model controls visibility; emits 'sent' when dispatched.

import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { sendPasswordResetEmail } from 'firebase/auth'

const props = withDefaults(defineProps<{
  /** v-model for open/close */
  modelValue: boolean
  /** optional email to prefill */
  prefill?: string
  /** optional redirect path if you have a custom reset page, e.g. '/auth/reset-password' */
  redirectPath?: string | null
}>(), {
  modelValue: false,
  prefill: '',
  redirectPath: null,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'sent', email: string): void
}>()

const auth = useFirebaseAuth()!

// Local state
const email = ref(props.prefill ?? '')
const loading = ref(false)
const sent = ref(false)
const errorMsg = ref('')

// a11y + focus management
const titleId = `fpw-title-${Math.random().toString(36).slice(2, 8)}`
const emailInputRef = ref<HTMLInputElement | null>(null)

// Basic email validation
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// When opened: reset state + focus input
watch(() => props.modelValue, (open) => {
  if (open) {
    email.value = props.prefill ?? email.value
    errorMsg.value = ''
    sent.value = false
    setTimeout(() => emailInputRef.value?.focus(), 0)
  }
})

// Close on ESC
const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.modelValue && !loading.value) close()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

function close() {
  emit('update:modelValue', false)
}

async function sendReset() {
  errorMsg.value = ''
  const target = email.value.trim()

  if (!isValidEmail(target)) {
    errorMsg.value = 'Please enter a valid email.'
    return
  }

  loading.value = true
  try {
    if (props.redirectPath) {
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      await sendPasswordResetEmail(auth, target, {
        url: `${origin}${props.redirectPath}`,
        handleCodeInApp: true,
      })
    } else {
      await sendPasswordResetEmail(auth, target)
    }
    emit('sent', target) // optional hook for parent
  } catch (err) {
    // Keep neutral; do not reveal if the email exists.
    console.warn('sendPasswordResetEmail error:', (err as any)?.code || err)
  } finally {
    sent.value = true
    loading.value = false
  }
}
</script>
