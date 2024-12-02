<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="bg-gradient-to-r from-maroon to-red-600 p-6 text-center">
        <h1 class="text-3xl font-bold text-white">Faculty Profile</h1>
      </div>
      <div class="p-8">
        <div class="text-center mb-8">
          <div class="relative">
            <img
              :src="profilePhoto || 'https://via.placeholder.com/150'"
              alt="Profile Picture"
              class="w-32 h-32 rounded-full object-cover mx-auto shadow-lg border-4 border-gray-100"
            />
            <label
              v-if="isEditing"
              for="file-upload"
              class="absolute bottom-0 right-0 bg-maroon text-white p-2 rounded-full cursor-pointer"
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
          <h2 class="text-xl font-semibold mt-4 text-gray-800">{{ profile.name }}</h2>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-lg font-bold text-maroon">Name:</label>
            <p class="text-lg font-medium text-gray-700">{{ profile.name }}</p>
          </div>

          <div>
            <label class="block text-lg font-bold text-maroon">Designation:</label>
            <p class="text-lg font-medium text-gray-700">{{ profile.designation }}</p>
          </div>

          <div>
            <label class="block text-lg font-bold text-maroon">Specialization:</label>
            <p v-if="!isEditing" class="text-lg font-medium text-gray-700">
              {{ profile.specialization }}
            </p>
            <input
              v-model="profile.specialization"
              type="text"
              class="w-full mt-2 border-gray-300 rounded-lg shadow-sm focus:border-maroon focus:ring-maroon"
              v-else
            />
          </div>

          <div>
  <label class="block text-lg font-bold text-maroon">
    Highest Educational Attainment:
  </label>

  <!-- Display Mode -->
  <div
    v-if="!isEditing"
    class="prose text-black"
    v-html="profile.educationHtml"
  ></div>

  <!-- Edit Mode -->
  <div v-else>
    <client-only>
      <quill-editor
        ref="quillEditorRef"
        v-model="profile.education"
        :options="editorOptions"
        class="border-gray-300 rounded-lg shadow-sm focus:border-maroon focus:ring-maroon"
        placeholder="Add your highest educational attainment"
      ></quill-editor>
    </client-only>
  </div>
</div>

          <div>
            <label class="block text-lg font-bold text-maroon">Email Address:</label>
            <p v-if="!isEditing" class="text-lg font-medium text-gray-700">
              {{ profile.email }}
            </p>
            <input
              v-model="profile.email"
              type="email"
              class="w-full mt-2 border-gray-300 rounded-lg shadow-sm focus:border-maroon focus:ring-maroon"
              v-else
            />
          </div>

          <div>
            <label class="block text-lg font-bold text-maroon">Websites:</label>
            <div v-if="!isEditing" class="space-y-2">
              <p
                v-for="(website, index) in profile.websites"
                :key="index"
                class="text-lg font-medium text-gray-700"
              >
                <a :href="website" target="_blank" class="text-blue-500 underline">{{
                  website
                }}</a>
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
                  class="w-full mt-2 border-gray-300 rounded-lg shadow-sm focus:border-maroon focus:ring-maroon"
                  placeholder="Enter website URL"
                />
                <button
                  @click="removeWebsite(index)"
                  class="text-red-500 hover:text-red-700"
                >
                  &times;
                </button>
              </div>
              <button
                @click="addWebsite"
                class="mt-2 px-4 py-2 text-sm bg-maroon text-white rounded-lg hover:bg-red-700"
              >
                Add Website
              </button>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 mt-8">
          <button
            class="px-5 py-2 text-white bg-gray-400 rounded-lg hover:bg-gray-600"
            v-if="isEditing"
            @click="toggleEdit"
          >
            Cancel
          </button>
          <button
            class="px-5 py-2 text-white bg-maroon rounded-lg hover:bg-red-700"
            v-if="isEditing"
            @click="saveProfile"
          >
            Save
          </button>
          <button
            class="px-5 py-2 text-white bg-maroon rounded-lg hover:bg-red-700"
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
import { ref, onMounted } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

definePageMeta({
  middleware: "auth",
  layout: "faculty",
});

const db = getFirestore();
const auth = getAuth();

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

const fetchProfile = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No user is logged in.");
    return;
  }

  const docRef = doc(db, "users", currentUser.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    console.debug("Retrieved HTML Content:", data.education); 
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
    console.error("No user data found.");
  }
};

const saveProfile = async () => {
  try {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    const contentHtml = quillEditorRef.value.getHTML();
    console.debug("Saving HTML Content:", contentHtml); 
    if (!contentHtml.trim()) {
      alert("Education field cannot be empty!");
      return;
    }

    const docRef = doc(db, "users", currentUser.uid);
    await updateDoc(docRef, {
      name: profile.value.name,
      designation: profile.value.designation,
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

onMounted(fetchProfile);
</script>

<style scoped>
.text-maroon {
  color: #740505;
}
.bg-maroon {
  background-color: #740505;
}



</style>
