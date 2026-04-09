import AuthGuard from '@/components/admin/auth-guard'
import AdminSidebar from '@/components/admin/sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 bg-gray-50 overflow-auto">
          <div className="max-w-5xl mx-auto p-6">{children}</div>
        </div>
      </div>
    </AuthGuard>
  )
}
