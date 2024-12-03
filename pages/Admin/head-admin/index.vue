<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="mx-auto max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
      <div class="from-maroon bg-gradient-to-r to-red-600 p-6 text-center">
        <h1 class="text-3xl font-bold text-white">Faculty Profile</h1>
      </div>
      <div class="p-8">
        <div class="mb-8 text-center">
          <div class="relative">
            <img
              :src="profilePhoto || 'https://via.placeholder.com/150'"
              alt="Profile Picture"
              class="mx-auto h-32 w-32 rounded-full border-4 border-gray-100 object-cover shadow-lg"
            />
            <label
              v-if="isEditing"
              for="file-upload"
              class="bg-maroon absolute bottom-0 right-0 cursor-pointer rounded-full p-2 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536M9 11l6-6m2 2l6-6M4 7h16M4 19h16M4 7h16"
                />
              </svg>
            </label>
            <input
              id="file-upload"
              type="file"
              class="hidden"
              accept="image/*"
              @change="uploadProfilePicture"
              v-if="isEditing"
            />
          </div>
          <h2 class="mt-4 text-xl font-semibold text-gray-800">{{ profile.name }}</h2>
        </div>

        <div class="space-y-6">
          <div>
            <label class="text-maroon block text-lg font-bold">Name:</label>
            <p class="text-lg font-medium text-gray-700">{{ profile.name }}</p>
          </div>

          <div>
            <label class="text-maroon block text-lg font-bold">Designation:</label>
            <p class="text-lg font-medium text-gray-700">{{ profile.designation }}</p>
          </div>

          <div>
            <label class="text-maroon block text-lg font-bold">Specialization:</label>
            <p v-if="!isEditing" class="text-lg font-medium text-gray-700">
              {{ profile.specialization }}
            </p>
            <input
              v-model="profile.specialization"
              type="text"
              class="focus:border-maroon focus:ring-maroon mt-2 w-full rounded-lg border-gray-300 shadow-sm"
              v-else
            />
          </div>

          <div>
            <label class="text-maroon block text-lg font-bold">
              Highest Educational Attainment:
            </label>

            <!-- Display Mode -->
            <div v-if="!isEditing" class="prose text-black" v-html="profile.educationHtml"></div>

            <!-- Edit Mode -->
            <div v-else>
              <client-only>
                <quill-editor
                  ref="quillEditorRef"
                  v-model="profile.education"
                  :options="editorOptions"
                  class="focus:border-maroon focus:ring-maroon rounded-lg border-gray-300 shadow-sm"
                  placeholder="Add your highest educational attainment"
                ></quill-editor>
              </client-only>
            </div>
          </div>

          <div>
            <label class="text-maroon block text-lg font-bold">Email Address:</label>
            <p v-if="!isEditing" class="text-lg font-medium text-gray-700">
              {{ profile.email }}
            </p>
            <input
              v-model="profile.email"
              type="email"
              class="focus:border-maroon focus:ring-maroon mt-2 w-full rounded-lg border-gray-300 shadow-sm"
              v-else
            />
          </div>

          <div>
            <label class="text-maroon block text-lg font-bold">Websites:</label>
            <div v-if="!isEditing" class="space-y-2">
              <p
                v-for="(website, index) in profile.websites"
                :key="index"
                class="text-lg font-medium text-gray-700"
              >
                <a :href="website" target="_blank" class="text-blue-500 underline">{{ website }}</a>
              </p>
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="(website, index) in profile.websites"
                :key="index"
                class="flex items-center space-x-2"
              >
                <input
                  v-model="profile.websites[index]"
                  type="url"
                  class="focus:border-maroon focus:ring-maroon mt-2 w-full rounded-lg border-gray-300 shadow-sm"
                  placeholder="Enter website URL"
                />
                <button @click="removeWebsite(index)" class="text-red-500 hover:text-red-700">
                  &times;
                </button>
              </div>
              <button
                @click="addWebsite"
                class="bg-maroon mt-2 rounded-lg px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Add Website
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-end gap-4">
          <button
            class="rounded-lg bg-gray-400 px-5 py-2 text-white hover:bg-gray-600"
            v-if="isEditing"
            @click="toggleEdit"
          >
            Cancel
          </button>
          <button
            class="bg-maroon rounded-lg px-5 py-2 text-white hover:bg-red-700"
            v-if="isEditing"
            @click="saveProfile"
          >
            Save
          </button>
          <button
            class="bg-maroon rounded-lg px-5 py-2 text-white hover:bg-red-700"
            v-else
            @click="toggleEdit"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import { onMounted, ref } from "vue";

import "@vueup/vue-quill/dist/vue-quill.snow.css";

import { getAuth } from "firebase/auth";
import { doc, getDoc, onSnapshot, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from "firebase/storage";

definePageMeta({
  middleware: "auth",
  layout: "faculty",
});

const db = getFirestore();
const auth = getAuth();
const storage = getStorage();

const isEditing = ref(false);
const profile = ref({
  name: "",
  designation: "",
  specialization: "",
  education: "",
  educationHtml: "",
  email: "",
  websites: [""],
});
const profilePhoto = ref("");

// Real-time profile data listener
const fetchProfileRealTime = () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No user is logged in.");
    return;
  }

  const docRef = doc(db, "users", currentUser.uid);
  onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      profile.value = {
        name: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        designation: data.designation || "N/A",
        specialization: data.specialization || "",
        education: data.education || "",
        educationHtml: data.education || "",
        email: data.email || "",
        websites: data.websites || [""],
      };
      profilePhoto.value = data.photo || "https://via.placeholder.com/150";
    } else {
      console.error("No profile data found.");
    }
  });
};

const uploadProfilePicture = async (event) => {
  try {
    const file = event.target.files[0];
    if (!file) {
      alert("No file selected!");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    // Define the storage path and upload the file
    const storagePath = `profile-pictures/${currentUser.uid}/${file.name}`;
    const imageRef = storageRef(storage, storagePath);
    await uploadBytes(imageRef, file);

    // Retrieve the public URL of the uploaded file
    const downloadURL = await getDownloadURL(imageRef);

    // Update the Firestore document
    const docRef = doc(db, "users", currentUser.uid);
    await updateDoc(docRef, { photo: downloadURL });

    // Update the UI immediately
    profilePhoto.value = downloadURL;
    alert("Profile picture updated successfully!");
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    alert("Failed to upload profile picture. Please try again.");
  }
};

const editorOptions = {
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, false] }],
      ["link"],
    ],
  },
};

const quillEditorRef = ref(null);

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const addWebsite = () => {
  profile.value.websites.push("");
};

const removeWebsite = (index) => {
  profile.value.websites.splice(index, 1);
};

const saveProfile = async () => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    const contentHtml = quillEditorRef.value.getHTML();
    if (!contentHtml.trim()) {
      alert("Education field cannot be empty!");
      return;
    }

    const docRef = doc(db, "users", currentUser.uid);
    await updateDoc(docRef, {
      specialization: profile.value.specialization,
      education: contentHtml,
      email: profile.value.email,
      websites: profile.value.websites.filter((url) => url.trim() !== ""),
    });

    profile.value.educationHtml = contentHtml;
    toggleEdit();
    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error saving profile:", error);
    alert("Failed to save changes. Please try again.");
  }
};

onMounted(() => {
  fetchProfileRealTime();
});
</script>


<style scoped>
  .text-maroon {
    color: #740505;
  }
  .bg-maroon {
    background-color: #740505;
  }
</style>
