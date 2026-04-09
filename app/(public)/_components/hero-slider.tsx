'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Slide } from '@/types'

interface HeroSliderProps {
  slides: Slide[]
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const total = slides.length

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total)
  }, [total])

  const prev = () => {
    setCurrent((prev) => (prev - 1 + total) % total)
  }

  useEffect(() => {
    if (total <= 1 || isPaused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, total, isPaused])

  if (total === 0) {
    return (
      <div className="w-full aspect-[16/9] md:aspect-[2/1] bg-[#1A1A2E] flex items-center justify-center">
        <span className="text-[#C4A265] text-lg font-semibold">종로타워</span>
      </div>
    )
  }

  return (
    <div
      className="relative w-full aspect-square md:aspect-[2/1] overflow-hidden bg-[#1A1A2E]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            idx === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
        >
          {slide.link_url ? (
            <Link href={slide.link_url}>
              <Image
                src={slide.image_url}
                alt={slide.alt_text}
                fill
                className="object-cover"
                priority={idx === 0}
                sizes="100vw"
              />
            </Link>
          ) : (
            <Image
              src={slide.image_url}
              alt={slide.alt_text}
              fill
              className="object-cover"
              priority={idx === 0}
              sizes="100vw"
            />
          )}
        </div>
      ))}

      {/* 이전/다음 버튼 */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
            aria-label="이전 슬라이드"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
            aria-label="다음 슬라이드"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* 인디케이터 */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  idx === current ? 'bg-[#C4A265] w-6' : 'bg-white/50'
                )}
                aria-label={`${idx + 1}번 슬라이드`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
