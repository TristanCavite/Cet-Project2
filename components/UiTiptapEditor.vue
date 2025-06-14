<template>
  <div>
    <!-- Toolbar -->
    <div v-if="editing" class="mb-4 flex flex-wrap items-center gap-2">
      <!-- Font Size -->
      <select class="select select-bordered h-9 min-w-[120px]" @change="setFontSize">
        <option disabled selected>Font Size</option>
        <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
      </select>

      <!-- Font Family -->
      <select class="select select-bordered h-9 min-w-[160px]" @change="setFontFamily">
        <option disabled selected>Font</option>
        <option value="Arial">Arial</option>
        <option value="'Times New Roman'">Times New Roman</option>
        <option value="Georgia">Georgia</option>
        <option value="'Courier New'">Courier New</option>
        <option value="Roboto">Roboto</option>
      </select>

      <!-- Color Palette -->
<div class="relative group">
  <button class="btn btn-sm bg-white border" title="Text Color">
    <div class="h-4 w-4 rounded" :style="{ backgroundColor: selectedColor }"></div>
  </button>
  <div class="absolute z-50 hidden group-hover:flex flex-wrap gap-1 p-2 bg-white border rounded shadow w-56">
    <button
      v-for="color in presetColors"
      :key="color"
      class="h-5 w-5 rounded border"
      :style="{ backgroundColor: color }"
      @click="applyColor(color)"
    />
  </div>
</div>


      <!-- Toolbar Buttons -->
      <button class="btn btn-sm" @click="editor?.chain().focus().toggleCustomBold().run()"><LucideBold class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().toggleItalic().run()"><LucideItalic class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().toggleUnderline().run()"><LucideUnderline class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
      <button class="btn btn-sm" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()">H3</button>
      <button class="btn btn-sm" @click="editor?.chain().focus().toggleBulletList().run()"><LucideList class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().toggleOrderedList().run()"><LucideListOrdered class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().setTextAlign('left').run()"><LucideAlignLeft class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().setTextAlign('center').run()"><LucideAlignCenter class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().setTextAlign('right').run()"><LucideAlignRight class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().setTextAlign('justify').run()"><LucideAlignJustify class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="addLink"><LucideLink class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="triggerImageUpload"><LucideImage class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().undo().run()"><LucideUndo class="h-4 w-4" /></button>
      <button class="btn btn-sm" @click="editor?.chain().focus().redo().run()"><LucideRedo class="h-4 w-4" /></button>
    </div>

    <EditorContent
  :editor="editor"
  class="prose w-full max-w-none rounded border border-gray-300 bg-white p-4 shadow overflow-auto"
  style="max-height: 800px; min-height: 300px"
/>

    <input ref="imageInput" type="file" class="hidden" @change="insertImages" accept="image/*" multiple />

  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3"
import StarterKit from "@tiptap/starter-kit"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import ResizeImage from "tiptap-extension-resize-image"
import Underline from "@tiptap/extension-underline"
import FontFamily from "@tiptap/extension-font-family"
import { CustomBold } from "@/extensions/CustomBold"
import { FontSize } from "@/extensions/FontSize"
import {
  LucideBold,
  LucideItalic,
  LucideUnderline,
  LucideList,
  LucideListOrdered,
  LucideAlignLeft,
  LucideAlignCenter,
  LucideAlignRight,
  LucideAlignJustify,
  LucideLink,
  LucideImage,
  LucideUndo,
  LucideRedo,
} from "lucide-vue-next"
import { ref, watch } from "vue"
import { useFirebaseStorage } from "vuefire"
import { uploadBytes, getDownloadURL, ref as storageRef } from "firebase/storage"

const props = defineProps<{ modelValue: string; editing: boolean }>()
const emit = defineEmits(["update:modelValue"])
const imageInput = ref<HTMLInputElement | null>(null)
const storage = useFirebaseStorage()
const fontSizes = ["12px", "14px", "16px", "18px", "24px", "32px", "48px"]
const selectedColor = ref("#000000");
const presetColors = [
  "#000000", "#808080", "#FFFFFF", "#FF0000", "#FFA500", "#FFFF00",
  "#008000", "#00FFFF", "#0000FF", "#800080", "#FFC0CB", "#A52A2A",
  "#B0E0E6", "#ADD8E6", "#90EE90", "#D3D3D3", "#FF69B4", "#9932CC",
];

const editor = useEditor({
  editable: props.editing,
  content: props.modelValue || "<p></p>",
  extensions: [
    StarterKit.configure({ bold: false }),
    TextStyle,
    FontSize.configure({ types: ["textStyle"] }),
    FontFamily.configure({ types: ["textStyle"] }),
    Color.configure({ types: ["textStyle", "customBold"] }),
    CustomBold,
    Underline,
    Link,
    Image,
    ResizeImage.configure({ allowBase64: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ],
  onUpdate: ({ editor }) => emit("update:modelValue", editor.getHTML()),
  editorProps: { transformPastedHTML: html => html },
})

watch(() => props.editing, newVal => editor.value?.setEditable(newVal))

function setFontSize(event: Event) {
  const size = (event.target as HTMLSelectElement).value
  editor.value?.chain().focus().setFontSize(size).run()
}

function setFontFamily(event: Event) {
  const font = (event.target as HTMLSelectElement).value
  editor.value?.chain().focus().setFontFamily(font).run()
}



function applyColor(color: string) {
  selectedColor.value = color;
  editor.value?.chain().focus().setColor(color).run();
}

function addLink() {
  const url = prompt("Enter URL:")
  if (!url) return
  editor.value?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
}

function triggerImageUpload() {
  imageInput.value?.click()
}

async function insertImages(e: Event) {
  const files = (e.target as HTMLInputElement)?.files;
  if (!files || files.length === 0) return;

  const editorInstance = editor.value;
  if (!editorInstance) return;

  for (const file of files) {
    const uniqueId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const path = `editor_images/${uniqueId}-${file.name}`;
    const ref = storageRef(storage, path);
    await uploadBytes(ref, file);
    const url = await getDownloadURL(ref);

    // Move cursor to end before each image
    editorInstance.commands.focus('end');

    // Insert image with paragraph break
    editorInstance.commands.insertContent([
      { type: 'paragraph' },
      { type: 'image', attrs: { src: url } },
      { type: 'paragraph' },
    ]);
  }

  if (imageInput.value) imageInput.value.value = "";
}





</script>

<style>
.EditorContent {
  /* remove this if present */
  min-height: 300px;
  max-height: 300px; /* ← bad */
  overflow-y: auto;  /* ← optional depending on behavior */
}
.ProseMirror img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
}

</style>