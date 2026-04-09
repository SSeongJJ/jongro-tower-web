export default function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-gray-400 mt-auto">
      <div className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[#C4A265] font-bold text-lg mb-1">종로타워</p>
            <p className="text-sm">서울특별시 종로구 종로 1</p>
          </div>
          <div className="text-sm space-y-1">
            <p>운영시간: 10:00 ~ 22:00</p>
            <p>주차: 지하 1~2층</p>
          </div>
        </div>
        <div className="border-t border-white/10 mt-6 pt-4 text-xs text-center text-gray-600">
          © {new Date().getFullYear()} 종로타워. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
