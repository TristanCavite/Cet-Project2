<template>
  <main class="p-10 h-212 bg-stone-200">
    <div class="mt-20 shadow-xl h-192 w-344 bg-neutral-50">
      <!-- edit button -->
      <div class="flex justify-end p-10">
        <UiButton class="bg-gray-600 hover:bg-red-900 w-36" @click="toggleEditAdmission">
          {{ editAdmission ? 'Close Editor' : 'Edit Admission' }}
        </UiButton>
      </div>
      <!-- editing section -->
      <div class="p-5 mx-auto border-2 shadow-xl border-neutral-400 w-224" v-if="editAdmission">
        <div class="">
          <form @submit.prevent="handleSubmit">
            <label for="file">Upload File:</label>
            <input
              type="file"
              id="file"
              @change="handleFileSelect"
              accept="image/*,video/*"
            />
            <button type="submit" :disabled="!selectedFile" class="w-32 h-10 bg-gray-600 rounded-md cursor-pointer hover:bg-red-900">Upload</button>
          </form>
          <div v-if="preview">
            <h3>Preview:</h3>
            <div v-if="isImage">
              <img :src="preview" alt="Image Preview" class="preview-image" />
            </div>
            <div v-else>
              <video :src="preview" controls class="preview-video"></video>
            </div>
          </div>
        </div>
        
        <div class="mt-5">
          <ClientOnly>
            <QuillEditor theme="snow" placeholder="Write something...">
              <template v-for="(_, name) of $slots" #[name]="slotData">
                <slot :name="name" v-bind="slotData" />
              </template>
            </QuillEditor>
          </ClientOnly>
        </div>
        <div class="flex justify-end mt-5">
          <UiButton class="bg-gray-600 hover:bg-red-900 w-36">Save</UiButton>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
  import { ref } from "vue";
  import { QuillEditor } from "@vueup/vue-quill";
  import "@vueup/vue-quill/dist/vue-quill.snow.css";

  // Add state management
  const editAdmission = ref(false);

  // Toggle function
  const toggleEditAdmission = () => {
    editAdmission.value = !editAdmission.value;
  };

  // File upload
  const selectedFile = ref<File | null>(null);
  const preview = ref<string | null>(null);
  const isImage = ref(true);

  const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files ? input.files[0] : null;
  if (file) {
    selectedFile.value = file;
    isImage.value = file.type.startsWith("image/");
    preview.value = URL.createObjectURL(file); // Generates a preview URL for the file
    }
  };

  const handleSubmit = async () => {
  if (!selectedFile.value) return;

  const formData = new FormData();
  formData.append("file", selectedFile.value);

  try {
    const response = await fetch("https://your-server-endpoint/upload", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      alert("File uploaded successfully!");
    } else {
      alert("Failed to upload file.");
    }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      preview.value = null;
      selectedFile.value = null;
    }
  };

  definePageMeta({
    layout: "super-admin",
  });
</script>

<style>
/* * {
  outline: 1px solid red;
} */
</style>