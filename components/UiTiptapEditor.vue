<template>
  <div>
    <!-- Toolbar -->
    <div v-if="editing" class="mb-4 flex flex-wrap items-center gap-2">
      <select class="select select-bordered h-9 min-w-[120px]" @change="setFontSize">
        <option disabled selected>Font Size</option>
        <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
      </select>
      <input type="color" class="h-9 w-9 rounded border" @change="setTextColor" />

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

    <!-- Editor -->
    <EditorContent
      :editor="editor"
      class="prose min-h-[300px] w-full max-w-none rounded border border-gray-300 bg-white p-4 shadow"
    />
    <input ref="imageInput" type="file" class="hidden" @change="insertImage" accept="image/*" />
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import ResizeImage from "tiptap-extension-resize-image";
import Underline from "@tiptap/extension-underline";
import { CustomBold } from "@/extensions/CustomBold";
import { FontSize } from "@/extensions/FontSize";
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
} from "lucide-vue-next";
import { ref, watch } from "vue";
import { useFirebaseStorage } from "vuefire";
import { uploadBytes, getDownloadURL, ref as storageRef } from "firebase/storage";

// Props
const props = defineProps<{
  modelValue: string;
  editing: boolean;
}>();
const emit = defineEmits(["update:modelValue"]);

const imageInput = ref<HTMLInputElement | null>(null);
const storage = useFirebaseStorage();

const fontSizes = ["12px", "14px", "16px", "18px", "24px", "32px", "48px"];

const editor = useEditor({
  editable: props.editing,
  content: props.modelValue || "<p></p>",
  extensions: [
    StarterKit.configure({ bold: false }),
    TextStyle,
    FontSize.configure({ types: ["textStyle"] }),
    Color.configure({ types: ["textStyle", "customBold"] }),
    CustomBold,
    Underline,
    Link,
    Image,
    ResizeImage.configure({ allowBase64: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
  ],
  onUpdate: ({ editor }) => {
    emit("update:modelValue", editor.getHTML());
  },
  editorProps: {
    transformPastedHTML: (html) => html,
  },
});

// Watch for prop change when toggling edit mode
watch(() => props.editing, (newVal) => {
  editor.value?.setEditable(newVal);
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

function addLink() {
  const url = prompt("Enter URL:");
  if (!url) return;
  editor.value?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

function triggerImageUpload() {
  imageInput.value?.click();
}

async function insertImage(e: Event) {
  const file = (e.target as HTMLInputElement)?.files?.[0];
  if (!file) return;
  const path = `editor_images/${Date.now()}-${file.name}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, file);
  const url = await getDownloadURL(ref);
  editor.value?.chain().focus().setImage({ src: url }).run();
  if (imageInput.value) imageInput.value.value = "";
}
</script>
