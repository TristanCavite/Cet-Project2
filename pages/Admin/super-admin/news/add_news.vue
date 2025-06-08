<template>
  <div class="mx-auto max-w-6xl space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">
        {{ isEditMode ? "Edit News" : "Create News" }}
      </h1>
      <div class="space-x-2">
        <UiButton
          class="text-maroon border-maroon hover:bg-maroon border bg-white hover:text-white"
          @click="handleClose"
        >
          Close
        </UiButton>
        <UiButton
          class="text-maroon border-maroon hover:bg-maroon border bg-white hover:text-white"
          @click="submitNews(false)"
        >
          Save
        </UiButton>
        <UiButton class="bg-maroon text-white hover:opacity-90" @click="submitNews(true)">
          Save & Publish
        </UiButton>
      </div>
    </div>

    <!-- Title, Author, Cover Image -->
    <div class="grid gap-6 md:grid-cols-2">
      <div>
        <label class="mb-1 block font-semibold">Title</label>
        <input v-model="title" type="text" class="input input-bordered w-full" />
      </div>
      <div>
        <label class="mb-1 block font-semibold">Author</label>
        <input v-model="author" type="text" class="input input-bordered w-full" />
      </div>
      <div class="md:col-span-2">
        <label class="mb-1 block font-semibold">Cover Image</label>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleImage"
          class="file-input file-input-bordered w-full"
        />
        <img v-if="imageUrl" :src="imageUrl" class="mt-2 h-48 w-full rounded object-cover" />
      </div>
    </div>

    <!-- Description -->
    <div>
      <label class="mb-1 block font-semibold">Description</label>
      <textarea v-model="description" rows="3" class="textarea textarea-bordered w-full" />
    </div>

    <!-- Content -->
    <div>
      <label class="mb-2 block font-semibold">Content</label>
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <button class="btn btn-sm" @click="editor?.chain().focus().toggleBold().run()">
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
        class="min-h-[300px] w-full rounded border bg-white p-4 shadow"
      />

      <input
        ref="editorImageInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleEditorImageUpload"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import BulletList from "@tiptap/extension-bullet-list";
  import Heading from "@tiptap/extension-heading";
  import Image from "@tiptap/extension-image";
  import Link from "@tiptap/extension-link";
  import ListItem from "@tiptap/extension-list-item";
  import OrderedList from "@tiptap/extension-ordered-list";
  import TextAlign from "@tiptap/extension-text-align";
  import Underline from "@tiptap/extension-underline";
  import StarterKit from "@tiptap/starter-kit";
  import { EditorContent, useEditor } from "@tiptap/vue-3";
  import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
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
  import ResizeImage from "tiptap-extension-resize-image"; // ✅ ADDED: ResizeImage extension
  import { onBeforeUnmount, onMounted, ref } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useFirebaseStorage, useFirestore } from "vuefire";

  definePageMeta({ layout: "super-admin" });

  const route = useRoute(); // 🌟 For detecting edit mode via query
  const router = useRouter();
  const db = useFirestore();
  const storage = useFirebaseStorage();

  const title = ref("");
  const description = ref("");
  const imageUrl = ref("");
  const author = ref("");
  const selectedFile = ref<File | null>(null);
  const fileInput = ref<HTMLInputElement | null>(null);
  const editorImageInput = ref<HTMLInputElement | null>(null)
  const isEditMode = ref(false); // ✅ Used to check if we're updating
  const newsId = ref(""); // ✅ Holds ID for updating

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Heading,
      BulletList,
      OrderedList,
      ListItem,
      Link,
      ResizeImage.configure({
        // ✅ ADDED: ResizeImage configuration
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "resizable-image",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p>Start writing your article here...</p>",
  });

  // ✅ Prefill form if editing
  onMounted(async () => {
    const id = route.query.id as string;
    if (id) {
      isEditMode.value = true;
      newsId.value = id;
      const snap = await getDoc(doc(db, "news", id));
      if (snap.exists()) {
        const data = snap.data();
        title.value = data.title || "";
        author.value = data.author || "";
        description.value = data.description || "";
        imageUrl.value = data.imageUrl || "";
        editor.value?.commands.setContent(data.content || "<p></p>");
      }
    }
  });

  async function handleImage(e: Event) {
    const file = (e.target as HTMLInputElement)?.files?.[0];
    if (!file) return alert("No image selected.");
    selectedFile.value = file;

    try {
      const path = `news_images/${Date.now()}-${file.name}`;
      const fileRef = storageRef(storage, path);
      const snap = await uploadBytes(fileRef, file);
      imageUrl.value = await getDownloadURL(snap.ref);
    } catch (error) {
      console.error("❌ Image upload failed:", error);
      alert("Failed to upload image. Please check your Firebase Storage settings.");
    }
  }

  function handleClose() {
    if (isEditMode.value && newsId.value) {
      // If editing, go back to that specific news detail
      router.push(`/Admin/super-admin/news/${newsId.value}`);
    } else {
      // Otherwise, go back to the news list
      router.push("/Admin/super-admin/news");
    }
  }

  async function handleEditorImageUpload(event: Event) {
  const file = (event.target as HTMLInputElement)?.files?.[0];
  if (!file) return alert("No image selected.");

  try {
    console.log("📤 Selected file:", file.name, file.size, file.type);
    const path = `editor_images/${Date.now()}-${file.name}`;
    const fileRef = storageRef(storage, path);
    console.log("📁 Upload path:", path);

    const snap = await uploadBytes(fileRef, file); // ❌ This is where it fails
    const downloadUrl = await getDownloadURL(snap.ref);
    console.log("✅ Image URL:", downloadUrl);

    editor.value?.chain().focus().setImage({ src: downloadUrl }).run();
  } catch (error: any) {
    console.error("❌ Failed to upload editor image:", error);
    alert("Failed to upload image for the editor.\n" + error.message);
  } finally {
    if (editorImageInput.value) editorImageInput.value.value = "";
  }
}


  // 🔄 Update or Add logic combined
  async function submitNews(publish: boolean) {
    if (!title.value || !editor.value?.getHTML()) {
      alert("Title and content are required.");
      return;
    }
    if (!imageUrl.value) {
      alert("Please upload a cover image.");
      return;
    }
    const data = {
      title: title.value,
      author: author.value,
      description: description.value,
      imageUrl: imageUrl.value,
      content: editor.value.getHTML(),
      published: publish,
      createdAt: serverTimestamp(),
    };
    try {
      if (isEditMode.value && newsId.value) {
        await setDoc(doc(db, "news", newsId.value), data);
        alert("News updated!");
      } else {
        await addDoc(collection(db, "news"), data);
        alert(publish ? "News published!" : "News saved as draft.");
      }
      router.push("/Admin/super-admin/news");
    } catch (error) {
      console.error("❌ Failed to save news:", error);
      alert("Failed to save news. Check your Firestore connection.");
    }
  }

  function addLink() {
    const url = prompt("Enter the link URL:");
    if (!url) return;
    editor.value?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

 // 📥 Trigger hidden file input for image insert
function addImage() {
  editorImageInput.value?.click()
}

  onBeforeUnmount(() => {
    editor.value?.destroy();
  });
</script>

<style>
  .text-maroon {
    color: #740505;
  }
  .bg-maroon {
    background-color: #740505;
  }
  .border-maroon {
    border-color: #740505;
  }

  /* ✅ Optional styling for resizable images */
  .resizable-image {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 0.5rem 0;
  }

  .ProseMirror {
    outline: none !important; /* removes default focus outline */
    border: none !important; /* removes any default border */
    box-shadow: none !important; /* removes box-shadow if present */
  }
  .EditorContent {
    border: 1px solid #e5e7eb; /* light gray */
    border-radius: 0.375rem; /* rounded-md */
    padding: 1rem;
    min-height: 300px;
    background-color: #ffffff;
  }
</style>
