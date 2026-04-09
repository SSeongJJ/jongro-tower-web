'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/common/toast'
import type { PasswordFormValues } from '@/types'

const passwordSchema = z
  .object({
    current_password: z.string().min(1, '현재 비밀번호를 입력하세요'),
    new_password: z
      .string()
      .min(8, '새 비밀번호는 8자 이상이어야 합니다')
      .regex(/[A-Za-z]/, '영문을 포함해야 합니다')
      .regex(/[0-9]/, '숫자를 포함해야 합니다'),
    confirm_password: z.string().min(1, '비밀번호 확인을 입력하세요'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: '새 비밀번호가 일치하지 않습니다',
    path: ['confirm_password'],
  })

export default function PasswordPage() {
  const { showToast } = useToast()
  const supabase = createClient()
  const [showFields, setShowFields] = useState({ current: false, new: false, confirm: false })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  const onSubmit = async (values: PasswordFormValues) => {
    // 현재 비밀번호 검증을 위해 재인증 후 업데이트
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) {
      showToast('인증 정보를 확인할 수 없습니다', 'error')
      return
    }

    // 현재 비밀번호 검증
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: values.current_password,
    })
    if (signInError) {
      showToast('현재 비밀번호가 올바르지 않습니다', 'error')
      return
    }

    // 비밀번호 변경
    const { error } = await supabase.auth.updateUser({
      password: values.new_password,
    })
    if (error) {
      showToast(error.message, 'error')
      return
    }

    showToast('비밀번호가 변경되었습니다')
    reset()
  }

  const inputClass =
    'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#C4A265]/30 focus:border-[#C4A265] transition-colors pr-10'

  const toggle = (field: keyof typeof showFields) =>
    setShowFields((prev) => ({ ...prev, [field]: !prev[field] }))

  const PasswordField = ({
    label,
    field,
    name,
    error,
    ...props
  }: {
    label: string
    field: keyof typeof showFields
    name: keyof PasswordFormValues
    error?: string
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          {...register(name)}
          type={showFields[field] ? 'text' : 'password'}
          className={inputClass}
          {...props}
        />
        <button
          type="button"
          onClick={() => toggle(field)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {showFields[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-bold text-gray-900 mb-6">비밀번호 변경</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl border border-gray-100 p-6 space-y-4"
      >
        <PasswordField
          label="현재 비밀번호"
          field="current"
          name="current_password"
          error={errors.current_password?.message}
        />
        <PasswordField
          label="새 비밀번호"
          field="new"
          name="new_password"
          error={errors.new_password?.message}
        />
        <PasswordField
          label="새 비밀번호 확인"
          field="confirm"
          name="confirm_password"
          error={errors.confirm_password?.message}
        />

        <p className="text-xs text-gray-400">
          영문 + 숫자 포함 8자 이상
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1A1A2E] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1A1A2E]/90 transition-colors disabled:opacity-50 mt-2"
        >
          {isSubmitting ? '변경 중...' : '비밀번호 변경'}
        </button>
      </form>
    </div>
  )
}
