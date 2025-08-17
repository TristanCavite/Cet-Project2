<template>
  <div class="mx-auto max-w-6xl space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Manage Admission Page</h1>
    </div>

    <!-- Section Selector -->
    <div>
      <label class="mb-1 block font-semibold">Select Section</label>
      <select v-model="selectedSection" class="select select-bordered w-full">
        <option disabled value="">-- Choose section --</option>
        <option value="why_choose_vsu">Why Choose VSU?</option>
        <option value="undergraduate">Undergraduate</option>
        <option value="graduate">Graduate</option>
      </select>
    </div>

    <!-- Form Section -->
    <div v-if="selectedSection" class="grid gap-6">
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
          alt="Admission cover"
        />
      </div>

      <!-- Promotional Video (only for 'Why Choose VSU?') -->
      <div v-if="selectedSection === 'why_choose_vsu'">
        <label class="mb-1 block font-semibold">Promotional Video (YouTube/Vimeo)</label>
        <input
          v-model="form.videoUrl"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          class="input input-bordered w-full"
        />
        <div v-if="form.videoUrl" class="mt-4 aspect-video w-full">
          <iframe
            :src="embedVideoUrl"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="h-full w-full rounded"
          ></iframe>
        </div>
      </div>

      <!-- Content -->
      <div>
        <label class="mb-2 block font-semibold">Content</label>

        <!-- Edit / Cancel toggle -->
        <UiButton class="bg-maroon text-white hover:opacity-90" @click="toggleEdit">
          {{ isEditing ? "Cancel" : "Edit Content" }}
        </UiButton>

        <!-- PREVIEW (identical wrapper to public pages) -->
        <div
          v-if="!isEditing"
          class="cet-content prose max-w-none rounded border bg-white p-4 shadow"
          v-html="form.content"
        />

        <!-- EDITOR (same wrapper so Edit looks exactly like Preview) -->
        <div v-else class="cet-content prose max-w-none rounded border bg-white p-4 shadow">
          <UiTiptapEditor
            v-model="form.content"
            :editing="isEditing"
            @image-upload="handleEditorImageUpload"
          />
        </div>

        <!-- Save -->
        <div class="mt-4 flex items-center justify-end gap-3">
          <span v-if="!isDirty" class="text-sm text-gray-400">No changes</span>
          <UiButton
            class="bg-maroon text-white hover:opacity-90 disabled:opacity-50"
            :disabled="!isDirty"
            @click="saveSection"
          >
            Save Changes
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Manage Admission Page (Admin)
 * Mirrors Manage About:
 * - Preview & Editor wrapped in `.cet-content prose` so both use the same typography (tiptap.css).
 * - Save button disabled until content differs from baseline (No changes detection).
 * - Video field only for 'why_choose_vsu'.
 */
import UiTiptapEditor from '@/components/UiTiptapEditor.vue'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage'
import { computed, ref, watch } from 'vue'
import { useFirebaseStorage, useFirestore } from 'vuefire'

definePageMeta({ middleware: 'auth', layout: 'super-admin' })

const db = useFirestore()
const storage = useFirebaseStorage()

/** UI state */
const isEditing = ref(false)
const selectedSection = ref('')

/** Form model */
const form = ref({
  coverImageUrl: '',
  content: '',
  videoUrl: '',
})

/** Baseline snapshot (for 'No changes' detection) */
const baseline = ref({ coverImageUrl: '', content: '', videoUrl: '' })

/** Load a section and reset the baseline */
watch(selectedSection, async (id) => {
  if (!id) return
  const snap = await getDoc(doc(db, 'admission_sections', id))
  if (snap.exists()) {
    const data = snap.data() as any
    form.value.coverImageUrl = data.coverImageUrl || ''
    form.value.content = data.content || ''
    form.value.videoUrl = data.videoUrl || ''
  } else {
    form.value.coverImageUrl = ''
    form.value.content = ''
    form.value.videoUrl = ''
  }
  baseline.value = { ...form.value } // preview equals loaded data
  isEditing.value = false            // exit edit mode on section change
})

/** Dirty checker mirrors Manage About */
const isDirty = computed(() =>
  form.value.coverImageUrl !== baseline.value.coverImageUrl ||
  form.value.content !== baseline.value.content ||
  form.value.videoUrl !== baseline.value.videoUrl
)

/** Upload cover image to Storage and set URL */
async function handleImage(e: Event) {
  const file = (e.target as HTMLInputElement)?.files?.[0]
  if (!file || !selectedSection.value) return
  const path = `admission_sections/${selectedSection.value}/cover.jpg`
  const fileRef = storageRef(storage, path)
  await uploadBytes(fileRef, file)
  const url = await getDownloadURL(fileRef)
  form.value.coverImageUrl = url
}

/** TipTap image uploader (returns URL to insert) */
async function handleEditorImageUpload(file: File) {
  const path = `editor_images/${Date.now()}-${file.name}`
  const fileRef = storageRef(storage, path)
  const snap = await uploadBytes(fileRef, file)
  return await getDownloadURL(snap.ref)
}

/** Save changes to Firestore; update baseline; exit edit mode */
async function saveSection() {
  if (!selectedSection.value || !isDirty.value) return
  const payload: Record<string, any> = {
    coverImageUrl: form.value.coverImageUrl,
    content: form.value.content,
  }
  if (selectedSection.value === 'why_choose_vsu') {
    payload.videoUrl = form.value.videoUrl
  }
  await setDoc(doc(db, 'admission_sections', selectedSection.value), payload /* , { merge: true } */)
  baseline.value = { ...form.value }
  isEditing.value = false
  alert('Section updated!')
}

/** Convert YT URLs to embed form; passthrough others (e.g., Vimeo embed) */
const embedVideoUrl = computed(() => {
  const url = (form.value.videoUrl || '').trim()
  if (!url) return ''
  try {
    if (url.includes('youtu.be')) {
      const id = url.split('/').pop()?.split('?')[0]
      return id ? `https://www.youtube.com/embed/${id}` : ''
    }
    if (url.includes('youtube.com/watch')) {
      const id = new URL(url).searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : ''
    }
    return url
  } catch {
    return ''
  }
})

/** Toggle edit mode with snapshot-safe cancel */
function toggleEdit() {
  if (isEditing.value) {
    // Cancel → revert any unsaved edits back to baseline
    form.value = { ...baseline.value }
    isEditing.value = false
  } else {
    isEditing.value = true
  }
}
</script>

<style>
/* Brand helper */
.bg-maroon { background-color: #740505; }
</style>
