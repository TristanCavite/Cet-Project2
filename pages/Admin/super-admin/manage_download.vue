<template>
  <div class="mx-auto max-w-6xl space-y-6">
    <!-- Top bar -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Manage Downloads</h1>

      <!-- Back -->
      <UiButton
        class="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        @click="goBack"
      >
        ← Back
      </UiButton>
    </div>

    <!-- Access control -->
    <div
      v-if="!loadingRole && !isSuperAdmin"
      class="rounded border border-red-200 bg-red-50 p-4 text-red-700"
    >
      You don’t have access to this page. Super Admin only.
    </div>

    <!-- Form -->
    <form v-else class="space-y-6" @submit.prevent="save">
      <!-- Basic fields -->
      <div class="grid gap-4 md:grid-cols-2">
        <!-- Title -->
        <div>
          <label class="mb-1 block text-sm font-medium">Title <span class="text-red-600">*</span></label>
          <input
            v-model.trim="form.title"
            type="text"
            placeholder="e.g. Student Forms & Policies"
            class="input input-bordered w-full"
            required
          />
        </div>

        <!-- Author -->
        <div>
          <label class="mb-1 block text-sm font-medium">Author <span class="text-red-600">*</span></label>
          <input
            v-model.trim="form.author"
            type="text"
            placeholder="e.g. Office of the Dean"
            class="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <!-- Content (Tiptap) -->
      <div>
        <label class="mb-2 block text-sm font-medium">Content</label>
        <!--
          Use your shared Tiptap component.
          v-model binds to "modelValue" prop internally.
          We set :editing="true" so the toolbar is active (you can add links).
        -->
        <UiTiptapEditor
          v-model="form.content"
          :editing="true"
          class="min-h-[320px]"
        />
        <p class="mt-1 text-xs text-gray-500">
          Tip: Use the 🔗 icon to insert hyperlinks (e.g., Google Drive links).
        </p>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <UiButton
          type="submit"
          class="bg-maroon text-white hover:opacity-90"
          :disabled="saving || !isValid"
        >
          {{ isEditMode ? 'Save Changes' : 'Publish' }}
        </UiButton>

        <UiButton
          type="button"
          class="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          @click="resetForm"
        >
          {{ isEditMode ? 'Cancel Edit' : 'Reset' }}
        </UiButton>

        <span v-if="saving" class="text-sm text-gray-500">Saving…</span>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
/**
 * MANAGE DOWNLOADS (Create / Edit)
 * - Fields: title, author, content (rich HTML with links)
 * - No cover image, no description
 * - Firestore collection: "downloads"
 * - Create mode (no id in route) / Edit mode (?id=abc)
 * - Super Admin access only
 */

definePageMeta({ layout: 'super-admin', middleware: 'auth' })

// Vue / Nuxt
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// VueFire
import { useCurrentUser, useFirestore } from 'vuefire'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'

// ------------------------------------------------------------------
// Setup
// ------------------------------------------------------------------
const router = useRouter()
const route = useRoute()
const db = useFirestore()
const currentUser = useCurrentUser()

// Route-based edit mode: /admin/super-admin/manage_download?id=DOC_ID
const editId = computed(() => (route.query.id ? String(route.query.id) : null))
const isEditMode = computed(() => !!editId.value)

// ------------------------------------------------------------------
// Access control (Super Admin only)
// Reads role from users/{uid}.role
// ------------------------------------------------------------------
const isSuperAdmin = ref(false)
const loadingRole = ref(true)

onMounted(async () => {
  // If not logged in, push to login
  if (!currentUser.value) {
    router.push('/login')
    return
  }

  try {
    const userRef = doc(db, 'users', currentUser.value.uid)
    const snap = await getDoc(userRef)
    const role = snap.exists() ? (snap.data().role as string | undefined) : undefined
    isSuperAdmin.value = role === 'Super Admin'
  } catch {
    isSuperAdmin.value = false
  } finally {
    loadingRole.value = false
  }

  // If editing, prefill the form from Firestore
  if (isSuperAdmin.value && isEditMode.value) {
    await loadForEdit()
  }
})

// ------------------------------------------------------------------
// Form state
// ------------------------------------------------------------------
const initialState = {
  title: '',
  author: '',
  content: '', // HTML string from Tiptap (includes links)
}

const form = reactive({ ...initialState })
const saving = ref(false)

// Validity
const isValid = computed(() => !!form.title && !!form.author)

// Prefill for edit
async function loadForEdit() {
  if (!editId.value) return
  const dref = doc(db, 'downloads', editId.value)
  const snap = await getDoc(dref)
  if (!snap.exists()) {
    // If document doesn't exist, go back to create mode
    router.replace({ path: route.path })
    return
  }
  const data = snap.data() as any
  form.title = data.title ?? ''
  form.author = data.author ?? ''
  form.content = data.content ?? ''
}

// Save (create/update)
async function save() {
  if (!isSuperAdmin.value || !isValid.value) return
  saving.value = true
  try {
    if (isEditMode.value && editId.value) {
      // Update existing document
      const dref = doc(db, 'downloads', editId.value)
      await updateDoc(dref, {
        title: form.title,
        author: form.author,
        content: form.content,
        updatedAt: serverTimestamp(),
        updatedBy: currentUser.value?.uid ?? null,
      })
    } else {
      // Create new document
      await addDoc(collection(db, 'downloads'), {
        title: form.title,
        author: form.author,
        content: form.content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: currentUser.value?.uid ?? null,
      })
      // After create, clear form
      Object.assign(form, { ...initialState })
    }
  } finally {
    saving.value = false
  }
}

// Reset / cancel edit
function resetForm() {
  if (isEditMode.value) {
    // Cancel edit -> reload original values from Firestore
    loadForEdit()
  } else {
    Object.assign(form, { ...initialState })
  }
}

// Back
function goBack() {
  // If you have a list page, change this to that route.
  router.back()
}
</script>

<style scoped>
/* Keep styles minimal; your design system/Tailwind handles most styling. */
</style>
