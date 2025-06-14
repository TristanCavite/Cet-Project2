<template>
  <div class="mx-auto max-w-6xl space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Manage Department Page</h1>
    </div>

    <!-- Form Section -->
    <div class="grid gap-6">
      <!-- Cover Image -->
      <div>
        <label class="mb-1 block font-semibold">Cover Image</label>
        <input
          type="file"
          class="file-input file-input-bordered w-full"
          accept="image/*"
          @change="handleImage"
        />
        <img
          v-if="form.coverImageUrl"
          :src="form.coverImageUrl"
          class="mt-2 h-48 w-full rounded object-cover"
        />
      </div>

      <!-- Content Section -->
      <div>
        <label class="mb-2 block font-semibold">Content</label>
        <UiButton
          class="bg-maroon text-white hover:opacity-90"
          @click="isEditing ? cancelEdit() : (isEditing = true)"
        >
          {{ isEditing ? "Cancel" : "Edit Content" }}
        </UiButton>

        <div
          v-if="!isEditing"
          class="prose max-w-none rounded border bg-white p-4 shadow"
          v-html="form.content"
        />

        <UiTiptapEditor
          v-else
          v-model="form.content"
          :editing="isEditing"
          class="mt-2"
          @image-upload="handleEditorImageUpload"
        />

        <div class="mt-4 flex justify-end">
          <UiButton class="bg-maroon text-white hover:opacity-90" @click="saveSection">
            Save Changes
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiTiptapEditor from '@/components/UiTiptapEditor.vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { ref, onMounted } from 'vue'
import { useFirestore, useFirebaseStorage, useCurrentUser } from 'vuefire'

const db = useFirestore()
const storage = useFirebaseStorage()
const user = useCurrentUser()

definePageMeta({
  middleware: 'auth',
  layout: 'head-admin',
})

const form = ref({
  coverImageUrl: '',
  content: '',
})
const isEditing = ref(false)
const originalContent = ref('')
const departmentId = ref('')

// 🔁 Load department-specific content from `department_pages/{id}`
onMounted(async () => {
  if (!user.value) return

  const userSnap = await getDoc(doc(db, 'users', user.value.uid))
  if (!userSnap.exists()) return

  departmentId.value = userSnap.data().departmentId
  if (!departmentId.value) return

  const deptPageSnap = await getDoc(doc(db, 'department_pages', departmentId.value))
  if (deptPageSnap.exists()) {
    const data = deptPageSnap.data()
    form.value.coverImageUrl = data.coverImageUrl || ''
    originalContent.value = data.content || ''
    form.value.content = data.content || ''
  }
})

// 🖼 Cover image upload to `departments/{id}/cover.jpg`
async function handleImage(e: Event) {
  const file = (e.target as HTMLInputElement)?.files?.[0]
  if (!file || !departmentId.value) return

  const path = `departments/${departmentId.value}/cover.jpg`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)
  form.value.coverImageUrl = url
}

// 🖋 Tiptap image upload
async function handleEditorImageUpload(file: File) {
  const path = `editor_images/${Date.now()}-${file.name}`
  const fileRef = storageRef(storage, path)
  const snap = await uploadBytes(fileRef, file)
  return await getDownloadURL(snap.ref)
}

// 💾 Save to `department_pages/{id}`
async function saveSection() {
  if (!departmentId.value) return

  await setDoc(doc(db, 'department_pages', departmentId.value), {
    coverImageUrl: form.value.coverImageUrl,
    content: form.value.content,
  }, { merge: true })

  isEditing.value = false
  alert('Department page updated!')
}

// 🔄 Cancel edits
function cancelEdit() {
  form.value.content = originalContent.value
  isEditing.value = false
}
</script>

<style>
.bg-maroon {
  background-color: #740505;
}
.ProseMirror {
  outline: none !important;
  border: none !important;
  box-shadow: none !important;
}
.EditorContent {
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 1rem;
  min-height: 300px;
  background-color: #ffffff;
}
.resizable-image {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 0.5rem 0;
}
.EditorContent span[style*='font-size'],
.EditorContent span[style*='color'] {
  display: inline-block;
}
</style>
