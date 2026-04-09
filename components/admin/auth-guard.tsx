// 서버 컴포넌트에서 인증 확인 — middleware.ts와 이중 방어
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AuthGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return <>{children}</>
}
