"use client";

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';

// Komponen Toolbar yang Sticky & Modern
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const btnStyle = "px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ";
  const activeStyle = "bg-emerald-600 text-white shadow-lg shadow-emerald-200 ring-2 ring-emerald-600";
  const inactiveStyle = "bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-100";

  return (
    <div className="flex flex-wrap gap-2 p-5 bg-emerald-50/90 border-b border-emerald-100 sticky top-0 z-10 backdrop-blur-md">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`${btnStyle} ${editor.isActive('bold') ? activeStyle : inactiveStyle}`}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${btnStyle} ${editor.isActive('italic') ? activeStyle : inactiveStyle}`}
      >
        Italic
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`${btnStyle} ${editor.isActive('heading', { level: 2 }) ? activeStyle : inertialStyle => inactiveStyle}`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${btnStyle} ${editor.isActive('bulletList') ? activeStyle : inactiveStyle}`}
      >
        List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`${btnStyle} ${editor.isActive('paragraph') ? activeStyle : inactiveStyle}`}
      >
        Text
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: { content: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: 'Tuliskan isi warta pondok di sini...',
      }),
    ],
    content: content,
    
    // PERBAIKAN KRUSIAL Next.js SSR
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Styling area ketik + injeksi CSS placeholder agar teks samaran muncul redup saat kosong
        class: 'prose prose-emerald max-w-none focus:outline-none p-10 min-h-full cursor-text text-slate-700 leading-relaxed [&_p.is-editor-empty:first-child]:before:text-slate-400 [&_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_p.is-editor-empty:first-child]:before:float-left [&_p.is-editor-empty:first-child]:before:pointer-events-none',
      },
    },
  });

  // 🟢 KUNCI AMAN DATA SYNC: Mengisi data lama ke dalam editor begitu data dari Supabase mendarat
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>', false);
    }
  }, [content, editor]);

  return (
    <div className="border border-slate-200 bg-white rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-[550px]">
      {/* Toolbar di bagian atas (Sticky) */}
      <MenuBar editor={editor} />
      
      {/* Area Ketik dengan Scroll Internal (Anti-Molor) */}
      <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Editor */}
      <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">
        Editor Warta Al Muttaqin Jepara
      </div>
    </div>
  );
}