'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { MAX_IMAGE_SIZE } from '@/lib/utils'

interface ImageUploaderProps {
  value?: string | null // 기존 이미지 URL
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number
  label?: string
}

export default function ImageUploader({
  value,
  onChange,
  accept = 'image/jpeg,image/png,image/webp',
  maxSize = MAX_IMAGE_SIZE,
  label = '이미지 업로드',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setError(null)
    if (file.size > maxSize) {
      setError(`파일 크기는 ${Math.floor(maxSize / 1024 / 1024)}MB 이하여야 합니다`)
      return
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    onChange(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const displayImage = preview || value

  return (
    <div className="space-y-2">
      {displayImage ? (
        <div className="relative w-40 h-40 rounded-lg overflow-hidden border border-gray-200">
          <Image src={displayImage} alt="미리보기" fill className="object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80 transition-colors"
            aria-label="이미지 제거"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-[#C4A265] hover:text-[#C4A265] transition-colors"
        >
          <Upload className="w-6 h-6 mb-2" />
          <span className="text-xs text-center">{label}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
