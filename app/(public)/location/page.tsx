import type { Metadata } from 'next'
import Link from 'next/link'
import { Car, Train, Bus } from 'lucide-react'

export const metadata: Metadata = {
  title: '오시는길',
}

export default function LocationPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">오시는길</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 지도 */}
        <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 min-h-80">
          {/* 카카오맵 API 키 확정 후 KakaoMap 컴포넌트로 교체 */}
          <div className="w-full h-full min-h-80 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-sm font-medium">지도</p>
              <p className="text-xs mt-1">서울특별시 종로구 종로 1</p>
            </div>
          </div>
        </div>

        {/* 교통 안내 */}
        <div className="space-y-4">
          {/* 지하철 */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Train className="w-5 h-5 text-[#C4A265]" />
              <h2 className="font-semibold text-gray-900">지하철</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>1호선 종각역 3번 출구 도보 2분</li>
              <li>5호선 광화문역 5번 출구 도보 5분</li>
            </ul>
          </div>

          {/* 버스 */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bus className="w-5 h-5 text-[#C4A265]" />
              <h2 className="font-semibold text-gray-900">버스</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>종각역 정류장 하차 — 간선: 100, 101, 150</li>
              <li>종로1가 정류장 하차 — 지선: 1020, 7018</li>
            </ul>
          </div>

          {/* 자가용 */}
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Car className="w-5 h-5 text-[#C4A265]" />
              <h2 className="font-semibold text-gray-900">자가용</h2>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>주소: 서울특별시 종로구 종로 1</li>
              <li>주차장: 건물 지하 1~2층</li>
            </ul>
            {/* 주차안내 바로가기 */}
            <Link
              href="/parking"
              className="inline-flex items-center gap-1 mt-3 text-sm text-[#C4A265] hover:underline font-medium"
            >
              주차안내 바로가기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
