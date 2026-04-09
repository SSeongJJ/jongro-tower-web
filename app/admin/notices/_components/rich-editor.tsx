'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useCallback } from 'react'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function RichEditor({ content, onChange }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ allowBase64: false }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[300px] px-4 py-3 outline-none',
      },
    },
  })

  const addImage = useCallback(async () => {
    const url = window.prompt('이미지 URL 또는 파일 업로드 URL을 입력하세요')
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    const url = window.prompt('링크 URL을 입력하세요')
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  const toolbarButton = (
    active: boolean,
    onClick: () => void,
    children: React.ReactNode,
    label: string
  ) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'p-1.5 rounded hover:bg-gray-100 transition-colors',
        active ? 'bg-gray-200 text-[#1A1A2E]' : 'text-gray-600'
      )}
      aria-label={label}
    >
      {children}
    </button>
  )

  return (
    <div>
      {/* 툴바 */}
      <div className="flex flex-wrap gap-0.5 px-3 py-2 border-b border-gray-200 bg-gray-50">
        {toolbarButton(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), <Bold className="w-4 h-4" />, '굵게')}
        {toolbarButton(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), <Italic className="w-4 h-4" />, '기울임')}
        <div className="w-px h-5 bg-gray-200 mx-1 self-center" />
        {toolbarButton(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), <Heading2 className="w-4 h-4" />, '제목 2')}
        {toolbarButton(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), <Heading3 className="w-4 h-4" />, '제목 3')}
        <div className="w-px h-5 bg-gray-200 mx-1 self-center" />
        {toolbarButton(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), <List className="w-4 h-4" />, '글머리 기호')}
        {toolbarButton(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), <ListOrdered className="w-4 h-4" />, '번호 목록')}
        <div className="w-px h-5 bg-gray-200 mx-1 self-center" />
        {toolbarButton(false, addImage, <ImageIcon className="w-4 h-4" />, '이미지')}
        {toolbarButton(editor.isActive('link'), addLink, <LinkIcon className="w-4 h-4" />, '링크')}
        <div className="w-px h-5 bg-gray-200 mx-1 self-center" />
        {toolbarButton(false, () => editor.chain().focus().undo().run(), <Undo className="w-4 h-4" />, '실행 취소')}
        {toolbarButton(false, () => editor.chain().focus().redo().run(), <Redo className="w-4 h-4" />, '다시 실행')}
      </div>

      {/* 에디터 영역 */}
      <EditorContent editor={editor} />
    </div>
  )
}
