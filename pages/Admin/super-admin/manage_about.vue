<template>
  <div class="mx-auto max-w-6xl space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Manage About Page</h1>
    </div>

    <!-- Section Selector -->
    <div>
      <label class="mb-1 block font-semibold">Select Section</label>
      <select v-model="selectedSection" class="select select-bordered w-full">
        <option disabled value="">-- Choose section --</option>
        <option value="the_college">The College</option>
        <option value="facilities">Facilities</option>
        <option value="map_location">Map and Location</option>
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
        />
      </div>

      <!-- College Promo Video -->
      <div v-if="selectedSection === 'the_college'">
        <label class="mb-1 block font-semibold">College Promotional Video (YouTube/Vimeo)</label>
        <input
          v-model="form.videoUrl"
          type="url"
          placeholder="https://www.youtube.com/embed/..."
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

      <!-- Content Section -->
      <div>
        <label class="mb-2 block font-semibold">Content</label>

        <!-- Edit / Cancel button shown above the content -->
        <div class="mb-4">
          <UiButton class="bg-maroon text-white hover:opacity-90" @click="isEditing = !isEditing">
            {{ isEditing ? "Cancel" : "Edit Content" }}
          </UiButton>
        </div>

        <!-- Preview -->
        <div
          v-if="!isEditing"
          class="prose max-w-none rounded border bg-white p-4 shadow"
          v-html="form.content"
        />

        <!-- Editor -->
        <UiTiptapEditor
          v-else
          v-model="form.content"
          :editing="isEditing"
          class="mt-2"
          @image-upload="handleEditorImageUpload"
        />

        <!-- Save Button for everything -->
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
  import UiTiptapEditor from "@/components/UiTiptapEditor.vue";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
  import { computed, ref, watch } from "vue";
  import { useFirebaseStorage, useFirestore } from "vuefire";

  const db = useFirestore();
  const storage = useFirebaseStorage();
  definePageMeta({ middleware: "auth", layout: "super-admin" });

  const isEditing = ref(false);
  const selectedSection = ref("");
  const form = ref({
    coverImageUrl: "",
    content: "",
    videoUrl: "",
  });

  watch(selectedSection, async (id) => {
    if (!id) return;
    const snap = await getDoc(doc(db, "about_sections", id));
    if (snap.exists()) {
      const data = snap.data();
      form.value.coverImageUrl = data.coverImageUrl || "";
      form.value.content = data.content || "";
      form.value.videoUrl = data.videoUrl || "";
      isEditing.value = false;
    }
  });

  async function handleImage(e: Event) {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    if (!file || !selectedSection.value) return;
    const path = `about_sections/${selectedSection.value}/cover.jpg`;
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    form.value.coverImageUrl = url;
  }

  async function handleEditorImageUpload(file: File) {
    const path = `editor_images/${Date.now()}-${file.name}`;
    const fileRef = storageRef(storage, path);
    const snap = await uploadBytes(fileRef, file);
    return await getDownloadURL(snap.ref);
  }

  async function saveSection() {
    if (!selectedSection.value) return;
    const payload: Record<string, any> = {
      coverImageUrl: form.value.coverImageUrl,
      content: form.value.content,
    };
    if (selectedSection.value === "the_college") {
      payload.videoUrl = form.value.videoUrl;
    }
    await setDoc(doc(db, "about_sections", selectedSection.value), payload);
    isEditing.value = false;
    alert("Section updated!");
  }

  const embedVideoUrl = computed(() => {
    const url = form.value.videoUrl.trim();
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop()?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  });
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

  .EditorContent span[style*="font-size"],
  .EditorContent span[style*="color"] {
    display: inline-block;
  }
</style>
