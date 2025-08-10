<template>
  <div class="mx-auto max-w-5xl px-4 py-8">
    <h1 class="text-maroon mb-6 text-2xl font-bold">
      {{ isEditMode ? "Edit Event" : "Add New Event" }}
    </h1>
    <div v-if="isEditMode" class="mb-4 text-sm text-gray-500">
      You are editing an existing event.
    </div>

    <!-- FORM -->
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Title -->
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <input
          v-model="form.title"
          type="text"
          required
          class="input input-bordered w-full"
          placeholder="Enter event title"
        />
      </div>

      <!-- Date Picker -->
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Date</label>
        <input v-model="form.date" type="date" required class="input input-bordered w-full" />
      </div>

      <!-- Description -->
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Short Description</label>
        <textarea
          v-model="form.description"
          rows="3"
          required
          class="textarea textarea-bordered w-full"
          placeholder="Enter a brief description of the event"
        />
      </div>

      <!-- Cover Images -->
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700">Cover Images</label>
        <input type="file" accept="image/*" multiple @change="handleFileChange" />

        <div v-if="previewUrls.length" class="mt-2 flex gap-4 overflow-x-auto">
          <img
            v-for="(src, i) in previewUrls"
            :key="i"
            :src="src"
            class="h-40 rounded border object-cover"
          />
        </div>
      </div>

      <!-- Tiptap Editor -->
      <div>
  
        <div @click.capture="suppressButtonSubmit">
          <label class="mb-1 block text-sm font-medium text-gray-700">Content</label>
          <UiTiptapEditor
            v-if="editorReady"
            :modelValue="form.content"
            :editing="true"
            class="rounded border border-gray-300 bg-white"
            @update:modelValue="(val) => (form.content = val)"
            @imageUpload="handleEditorImageUpload"
          />
        </div>
      </div>

      <!-- Save Button -->
      <div class="pt-4">
        <UiButton class="bg-maroon text-white" type="submit" :disabled="loading">
          {{ loading ? "Saving..." : isEditMode ? "Update Event" : "Create Event" }}
        </UiButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
  import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
  import { computed, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useFirestore, useStorage } from "vuefire";

  definePageMeta({ layout: "super-admin" });

  const db = useFirestore();
  const storage = useStorage();
  const router = useRouter();
  const route = useRoute();

  const isEditMode = computed(() => !!route.query.id);

  const form = ref({
    title: "",
    date: "",
    description: "",
    content: "",
    coverImages: [] as string[],
  });

  const imageFiles = ref<File[]>([]);
  const previewUrls = ref<string[]>([]);
  const loading = ref(false);
  const editorReady = ref(false);

  const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    if (!files) return;
    imageFiles.value = Array.from(files);
    previewUrls.value = imageFiles.value.map((file) => URL.createObjectURL(file));
  };

  // Load existing event
  onMounted(async () => {
    const id = route.query.id as string;
    editorReady.value = true;
    if (isEditMode.value && id) {
      const snap = await getDoc(doc(db, "events", id));
      if (snap.exists()) {
        const data = snap.data();
        form.value = {
          title: data.title || "",
          date: data.date || "",
          description: data.description || "",
          content: data.content || "",
          coverImages: data.coverImages || [],
        };
        previewUrls.value = form.value.coverImages;
      }
    }

    // ✅ Always show editor — even if blank for new events
    
  });

  const handleSubmit = async () => {
    loading.value = true;
    try {
      const id = (route.query.id as string) || crypto.randomUUID();
      let uploadedUrls: string[] = form.value.coverImages || [];

      if (imageFiles.value.length) {
        uploadedUrls = [];
        for (const [index, file] of imageFiles.value.entries()) {
          const path = `events/${id}/cover_${index}.jpg`;
          const fileRef = storageRef(storage, path);
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          uploadedUrls.push(url);
        }
      }

      const eventData: any = {
        ...form.value,
        coverImages: uploadedUrls,
        updatedAt: serverTimestamp(),
      };

      if (!isEditMode.value) {
        eventData.createdAt = serverTimestamp();
      }

      await setDoc(doc(db, "events", id), eventData, { merge: true });
      router.push("/admin/super-admin/events");
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      loading.value = false;
    }
  };

  // Tiptap inline image upload
  const handleEditorImageUpload = async (file: File): Promise<string> => {
    const fileId = crypto.randomUUID();
    const path = `events/editor/${fileId}`;
    const fileRef = storageRef(storage, path);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  };
  function suppressButtonSubmit(event: Event) {
    const target = event.target as HTMLElement;
    if (target?.tagName === "BUTTON") {
      event.preventDefault();
    }
  }
</script>
