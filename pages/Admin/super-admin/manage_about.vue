//manage_about.vue
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

      <!-- ✅ College Promotional Video URL Field (Only for the_college) -->
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

      <!-- Tiptap Toolbar + Editor -->
      <div>
        <label class="mb-2 block font-semibold">Content</label>
        <div class="mb-4 flex flex-wrap items-center gap-2">
          <select
            class="select select-bordered h-9 min-w-[120px] px-2 py-1 text-sm"
            @change="setFontSize($event)"
          >
            <option disabled selected>Font Size</option>
            <option value="12px">12px</option>
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="24px">24px</option>
            <option value="32px">32px</option>
            <option value="48px">48px</option>
          </select>

          <input
            type="color"
            class="h-9 w-9 cursor-pointer rounded border p-0"
            title="Choose text color"
            @change="setTextColor"
          />

          <button class="btn btn-sm" @click="editor?.chain().focus().toggleCustomBold().run()">
  <LucideBold class="h-4 w-4" />
</button>


          <button class="btn btn-sm" @click="editor?.chain().focus().toggleItalic().run()">
            <LucideItalic class="h-4 w-4" />
          </button>
          <button class="btn btn-sm" @click="editor?.chain().focus().toggleUnderline().run()">
            <LucideUnderline class="h-4 w-4" />
          </button>
          <button
            class="btn btn-sm"
            @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
          >
            H2
          </button>
          <button
            class="btn btn-sm"
            @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
          >
            H3
          </button>
          <button class="btn btn-sm" @click="editor?.chain().focus().toggleBulletList().run()">
            <LucideList class="h-4 w-4" />
          </button>
          <button class="btn btn-sm" @click="editor?.chain().focus().toggleOrderedList().run()">
            <LucideListOrdered class="h-4 w-4" />
          </button>
          <button class="btn btn-sm" @click="editor?.chain().focus().setTextAlign('left').run()">
            <LucideAlignLeft class="h-4 w-4" />
          </button>
          <button class="btn btn-sm" @click="editor?.chain().focus().setTextAlign('center').run()">
            <LucideAlignCenter class="h-4 w-4" />
          </button>
          <button class="btn btn-sm" @click="editor?.chain().focus().setTextAlign('right').run()">
            <LucideAlignRight class="h-4 w-4" />
          </button>
          <button class="btn btn-sm" @click="editor?.chain().focus().setTextAlign('justify').run()">
            <LucideAlignJustify class="h-4 w-4" />
          </button>
          <button class="btn btn-sm" @click="addLink"><LucideLink class="h-4 w-4" /></button>
          <button class="btn btn-sm" @click="addImage"><LucideImage class="h-4 w-4" /></button>
          <button class="btn btn-sm" @click="editor?.chain().focus().undo().run()">
            <LucideUndo class="h-4 w-4" />
          </button>
          <button class="btn btn-sm" @click="editor?.chain().focus().redo().run()">
            <LucideRedo class="h-4 w-4" />
          </button>
        </div>
        <EditorContent
          :editor="editor"
          class="prose min-h-[300px] w-full max-w-none rounded border border-gray-300 bg-white p-4 shadow focus:outline-none"
        />
        <input
          ref="editorImageInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleEditorImageUpload"
        />
      </div>

      <!-- Save Button -->
      <div>
        <UiButton class="bg-maroon text-white hover:opacity-90" @click="saveSection">
          Save Changes
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CustomBold } from "@/extensions/CustomBold";
  import { FontSize } from "@/extensions/FontSize";
  import Color from "@tiptap/extension-color";
  import Image from "@tiptap/extension-image";
  import Link from "@tiptap/extension-link";
  import TextAlign from "@tiptap/extension-text-align";
  import TextStyle from "@tiptap/extension-text-style";
  import Underline from "@tiptap/extension-underline";
  import StarterKit from "@tiptap/starter-kit";
  import { EditorContent, useEditor } from "@tiptap/vue-3";
  import { doc, getDoc, setDoc } from "firebase/firestore";
  import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
  import {
    AlignCenter as LucideAlignCenter,
    AlignJustify as LucideAlignJustify,
    AlignLeft as LucideAlignLeft,
    AlignRight as LucideAlignRight,
    Bold as LucideBold,
    Image as LucideImage,
    Italic as LucideItalic,
    Link as LucideLink,
    List as LucideList,
    ListOrdered as LucideListOrdered,
    Redo as LucideRedo,
    Underline as LucideUnderline,
    Undo as LucideUndo,
  } from "lucide-vue-next";
  import ResizeImage from "tiptap-extension-resize-image";
  import { computed, ref, watch } from "vue";
  import { useFirebaseStorage, useFirestore } from "vuefire";

  const db = useFirestore();
  const storage = useFirebaseStorage();
  definePageMeta({ middleware: "auth", layout: "super-admin" });

  const selectedSection = ref("");
  const editorImageInput = ref<HTMLInputElement | null>(null);

  const form = ref({
    coverImageUrl: "",
    content: "",
    videoUrl: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false, // ✅ disable default bold
      }),
      TextStyle, // ✅ required for color support
      FontSize,
      Color.configure({ types: ["textStyle", "customBold"] }),
      CustomBold, // ✅ replaces native Bold
      Underline,
      Link,
      Image,
      ResizeImage.configure({
        allowBase64: true,
        inline: false,
        HTMLAttributes: { class: "resizable-image" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p>Start editing content here...</p>",
  });

  function setFontSize(event: Event) {
    const size = (event.target as HTMLSelectElement).value;
    if (!size) return;
    editor.value?.chain().focus().setFontSize(size).run();
  }

  function setTextColor(event: Event) {
    const color = (event.target as HTMLInputElement).value;
    if (!color) return;
    editor.value?.chain().focus().setColor(color).run();
  }

  watch(selectedSection, async (id) => {
    if (!id) return;
    const snap = await getDoc(doc(db, "about_sections", id));
    if (snap.exists()) {
      const data = snap.data();
      form.value.coverImageUrl = data.coverImageUrl || "";
      form.value.content = data.content || "";
      form.value.videoUrl = data.videoUrl || "";
      editor.value?.commands.setContent(data.content || "<p></p>");
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

  async function handleEditorImageUpload(e: Event) {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const path = `editor_images/${Date.now()}-${file.name}`;
    const fileRef = storageRef(storage, path);
    const snap = await uploadBytes(fileRef, file);
    const url = await getDownloadURL(snap.ref);
    editor.value?.chain().focus().setImage({ src: url }).run();
    if (editorImageInput.value) editorImageInput.value.value = "";
  }

  function addImage() {
    editorImageInput.value?.click();
  }

  function addLink() {
    const url = prompt("Enter the link URL:");
    if (!url) return;
    editor.value?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  async function saveSection() {
    if (!selectedSection.value) return;
    const payload: Record<string, any> = {
      coverImageUrl: form.value.coverImageUrl,
      content: editor.value?.getHTML() || "",
    };
    if (selectedSection.value === "the_college") {
      payload.videoUrl = form.value.videoUrl;
    }
    await setDoc(doc(db, "about_sections", selectedSection.value), payload);
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
    border: 1px solid #e5e7eb; /* Tailwind border-gray-300 */
    border-radius: 0.375rem; /* rounded-md */
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

  .EditorContent span[style*="font-size"] {
    display: inline-block;
  }
</style>
