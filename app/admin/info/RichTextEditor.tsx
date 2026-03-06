"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

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
        className={`${btnStyle} ${editor.isActive('heading', { level: 2 }) ? activeStyle : inactiveStyle}`}
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
    extensions: [StarterKit],
    content: content,
    
    // PERBAIKAN: Mencegah error SSR/Hydration pada Next.js
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Styling area ketik agar rapi dan profesional
        class: 'prose prose-emerald max-w-none focus:outline-none p-10 min-h-full cursor-text text-slate-700 leading-relaxed',
      },
    },
  });

  return (
    <div className="border border-slate-200 bg-white rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-[550px]">
      {/* Toolbar di bagian atas */}
      <MenuBar editor={editor} />
      
      {/* Area Ketik dengan Scroll Internal (Anti-Molor) */}
      <div className="flex-1 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-emerald-200">
        <EditorContent editor={editor} />
      </div>

      {/* Footer Editor (Opsional) */}
      <div className="px-6 py-2 bg-slate-50 border-t border-slate-100 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">
        Editor Warta Al Muttaqin
      </div>
    </div>
  );
}