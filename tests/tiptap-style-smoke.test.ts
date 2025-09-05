import { JSDOM } from 'jsdom'
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from '../extensions/FontSize'
import { CustomBold } from '../extensions/CustomBold'
import assert from 'node:assert'

// jsdom setup
const { window } = new JSDOM('<!doctype html><html><body></body></html>')
// @ts-ignore
global.window = window
// @ts-ignore
global.document = window.document

const editor = new Editor({
  extensions: [
    StarterKit.configure({ bold: false }),
    TextStyle,
    FontSize,
    FontFamily.configure({ types: ['textStyle', 'customBold'] }),
    Color.configure({ types: ['textStyle', 'customBold'] }),
    CustomBold,
  ],
})

const html = `<p><span style="color: #ff0000; font-family: Georgia;" class="fs-24" data-fs="24px">Test</span></p>`
editor.commands.setContent(html, { emitUpdate: false })
const output = editor.getHTML()

assert.ok(output.includes('color: #ff0000'))
assert.ok(output.includes('font-family: Georgia'))
assert.ok(output.includes('class="fs-24"'))
