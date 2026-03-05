"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { useEffect } from "react"

export default function RichTextEditor({
  content,
  onChange,
}: {
  content: string
  onChange: (content: string) => void
}) {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image
    ],

    content: content,

    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  if (!editor) return null

  return (
    <div className="border rounded-xl bg-white">

      {/* TOOLBAR */}
      <div className="flex flex-wrap gap-2 border-b p-2 bg-gray-50">

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-3 py-1 border rounded hover:bg-gray-200"
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-3 py-1 border rounded hover:bg-gray-200"
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="px-3 py-1 border rounded hover:bg-gray-200"
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="px-3 py-1 border rounded hover:bg-gray-200"
        >
          H3
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-3 py-1 border rounded hover:bg-gray-200"
        >
          Bullet List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-3 py-1 border rounded hover:bg-gray-200"
        >
          Number List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 border rounded hover:bg-gray-200"
        >
          Divider
        </button>

      </div>

      {/* EDITOR AREA */}
      <div className="h-[350px] overflow-y-auto p-4">

        <EditorContent
          editor={editor}
          className="prose max-w-none focus:outline-none"
        />

      </div>

    </div>
  )
}