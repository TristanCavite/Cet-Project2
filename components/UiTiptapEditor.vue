<!-- components/UiTiptapEditor.vue -->
<template>
  <div>
    <!-- Toolbar -->
    <div v-if="editing" class="mb-4 flex flex-wrap items-center gap-2">
      <!-- Font Size -->
      <select class="select select-bordered h-9 min-w-[120px]" @change="onFontSizeChange">
        <option disabled selected>Font Size</option>
        <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
      </select>

      <!-- Font Family -->
      <select class="select select-bordered h-9 min-w-[160px]" @change="onFontFamilyChange">
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
            type="button"
            v-for="color in presetColors"
            :key="color"
            class="h-5 w-5 rounded border"
            :style="{ backgroundColor: color }"
            @click="onColorPick(color)"
          />
        </div>
      </div>

      <!-- Buttons -->
      <button type="button" class="btn btn-sm" @click="editor?.chain().focus().toggleCustomBold().run()">
        <LucideBold class="h-4 w-4" />
      </button>
      <button type="button" class="btn btn-sm" @click="editor?.chain().focus().toggleItalic().run()">
        <LucideItalic class="h-4 w-4" />
      </button>
      <button type="button" class="btn btn-sm" @click="editor?.chain().focus().toggleUnderline().run()">
        <LucideUnderline class="h-4 w-4" />
      </button>
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
class="w-full max-w-none rounded border border-gray-300 bg-white p-4 shadow overflow-auto"
style="max-height: 800px; min-height: 300px"
/>

    <input ref="imageInput" type="file" class="hidden" @change="insertImages" accept="image/*" multiple />
  </div>
</template>

<script setup lang="ts">
import { EditorContent, useEditor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import ResizeImage from 'tiptap-extension-resize-image'
import Underline from '@tiptap/extension-underline'
import FontFamily from '@tiptap/extension-font-family'
import { CustomBold } from '@/extensions/CustomBold'
import FontSize, { FONT_SIZE_VALUES, isFontSizeValue } from '@/extensions/FontSize'
import type { FontSizeValue } from '@/extensions/FontSize'

import {
  LucideBold, LucideItalic, LucideUnderline, LucideList, LucideListOrdered,
  LucideAlignLeft, LucideAlignCenter, LucideAlignRight, LucideAlignJustify,
  LucideLink, LucideImage, LucideUndo, LucideRedo,
} from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useFirebaseStorage } from 'vuefire'
import { uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage'

const props = defineProps<{ modelValue: string; editing: boolean }>()
const emit = defineEmits(['update:modelValue'])

const imageInput = ref<HTMLInputElement | null>(null)
const storage = useFirebaseStorage()

const fontSizes: FontSizeValue[] = [...FONT_SIZE_VALUES]
const selectedColor = ref('#000000')
const presetColors = [
  '#000000', '#808080', '#FFFFFF', '#FF0000', '#FFA500', '#FFFF00',
  '#008000', '#00FFFF', '#0000FF', '#800080', '#FFC0CB', '#A52A2A',
  '#B0E0E6', '#ADD8E6', '#90EE90', '#D3D3D3', '#FF69B4', '#9932CC',
]

/* Convert legacy inline font-size -> fs-* (client-only) */
function convertInlineFontSizesToClasses(html: string): string {
  if (typeof window === 'undefined' || !html) return html
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    doc.body.querySelectorAll<HTMLElement>('[style*="font-size"]').forEach((el) => {
      const styleAttr = el.getAttribute('style') || ''
      const match = styleAttr.match(/font-size:\s*(\d+)px/i)
      if (!match) return
      const px = match[1]
      const size = `${px}px`
      if (!isFontSizeValue(size)) return

      const newStyle = styleAttr.replace(/font-size:\s*\d+px;?\s*/i, '').trim()
      if (newStyle) el.setAttribute('style', newStyle)
      else el.removeAttribute('style')

      el.classList.add(`fs-${px}`)
      el.setAttribute('data-fs', size)
    })

    return doc.body.innerHTML
  } catch {
    return html
  }
}

const editor = useEditor({
  editable: props.editing,
  content: convertInlineFontSizesToClasses(props.modelValue || '<p></p>'),
  extensions: [
    StarterKit.configure({ bold: false }), // using CustomBold
    TextStyle,
    FontSize, // class-based font size mark
    FontFamily.configure({ types: ['textStyle'] }),
    Color.configure({ types: ['textStyle', 'customBold'] }),
    CustomBold,
    Underline,
    Link,
    Image,
    ResizeImage.configure({ allowBase64: true }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ],
  onUpdate: ({ editor }) => emit('update:modelValue', editor.getHTML()),
  editorProps: {
    transformPastedHTML: (html) => convertInlineFontSizesToClasses(html),
  },
})

watch(() => props.editing, (val) => editor.value?.setEditable(val))
watch(
  () => props.modelValue,
  (val) => {
    const normalized = convertInlineFontSizesToClasses(val || '<p></p>')
    const current = editor.value?.getHTML()
    if (editor.value && normalized !== current) {
      editor.value.commands.setContent(normalized, false)
    }
  },
)

/* ==== Robust re-apply flow: extend → unset → set ==== */
function onFontSizeChange(event: Event) {
  const raw = (event.target as HTMLSelectElement).value
  if (!isFontSizeValue(raw)) return
  editor.value
    ?.chain()
    .focus()
    .extendMarkRange('fontSize')  // grab whole current-size run if caret sits inside
    .unsetFontSize()              // clear any existing size in that run
    .setFontSize(raw)             // apply the new size
    .run()
}

function onFontFamilyChange(event: Event) {
  const font = (event.target as HTMLSelectElement).value
  editor.value
    ?.chain()
    .focus()
    .extendMarkRange('textStyle') // textStyle is used by FontFamily/Color
    .setFontFamily(font)
    .run()
}

function onColorPick(color: string) {
  selectedColor.value = color
  editor.value
    ?.chain()
    .focus()
    .extendMarkRange('textStyle')
    .setColor(color)
    .run()
}

/* Misc */
function addLink() {
  const url = prompt('Enter URL:')
  if (!url) return
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

function triggerImageUpload() {
  imageInput.value?.click()
}

async function insertImages(e: Event) {
  const files = (e.target as HTMLInputElement)?.files
  if (!files || files.length === 0) return
  const ed = editor.value
  if (!ed) return

  for (const file of Array.from(files)) {
    const uniqueId = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const path = `editor_images/${uniqueId}-${file.name}`
    const refObj = storageRef(storage, path)
    await uploadBytes(refObj, file)
    const url = await getDownloadURL(refObj)

    ed.commands.focus('end')
    ed.commands.insertContent([
      { type: 'paragraph' },
      { type: 'image', attrs: { src: url } },
      { type: 'paragraph' },
    ])
  }

  if (imageInput.value) imageInput.value.value = ''
}
</script>

<style scoped>
/* Editor base */
:deep(.ProseMirror) {
  min-height: 300px;
  /* do NOT set color/font-family here — it overrides heading styling */
}

:deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
}

/* Make headings inside the editor use the same maroon + Times */
:deep(.ProseMirror h1),
:deep(.ProseMirror h2),
:deep(.ProseMirror h3) {
  color: var(--cet-heading) !important;
  font-family: var(--cet-heading-font) !important;
}

/* Keep fs-* sizes authoritative inside editor */
:deep(.ProseMirror .fs-12) { font-size: clamp(12px, 2.8vw, 12px) !important; }
:deep(.ProseMirror .fs-14) { font-size: clamp(13px, 3.2vw, 14px) !important; }
:deep(.ProseMirror .fs-16) { font-size: clamp(14px, 3.6vw, 16px) !important; }
:deep(.ProseMirror .fs-18) { font-size: clamp(16px, 4.0vw, 18px) !important; }
:deep(.ProseMirror .fs-24) { font-size: clamp(18px, 5.5vw, 24px) !important; }
:deep(.ProseMirror .fs-32) { font-size: clamp(22px, 7.4vw, 32px) !important; }
:deep(.ProseMirror .fs-48) { font-size: clamp(28px, 10.5vw, 48px) !important; }

/* pointer for links inside the editor content */
:deep(.ProseMirror a) { cursor: pointer; }
</style>
