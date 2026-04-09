import type { Metadata } from 'next'
import { Car, Clock, CreditCard, Info } from 'lucide-react'

export const metadata: Metadata = {
  title: '주차안내',
}

export default function ParkingPage() {
  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">주차안내</h1>

      <div className="space-y-5">
        {/* 주차장 위치 */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Car className="w-5 h-5 text-[#C4A265]" />
            <h2 className="font-semibold text-gray-900">주차장 위치</h2>
          </div>
          <p className="text-sm text-gray-600">건물 지하 1층 ~ 지하 2층</p>
        </div>

        {/* 운영시간 */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-[#C4A265]" />
            <h2 className="font-semibold text-gray-900">운영시간</h2>
          </div>
          <p className="text-sm text-gray-600">매일 07:00 ~ 23:00</p>
        </div>

        {/* 요금 안내 */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-5 h-5 text-[#C4A265]" />
            <h2 className="font-semibold text-gray-900">요금 안내</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">구분</th>
                <th className="text-left py-2 text-gray-500 font-medium">요금</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr>
                <td className="py-2.5 text-gray-700">최초 30분</td>
                <td className="py-2.5 text-gray-700">무료</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-700">30분 초과 10분당</td>
                <td className="py-2.5 text-gray-700">500원</td>
              </tr>
              <tr>
                <td className="py-2.5 text-gray-700">1일 최대</td>
                <td className="py-2.5 text-gray-700">30,000원</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 할인 안내 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-amber-600" />
            <h2 className="font-semibold text-amber-800">주차 할인</h2>
          </div>
          <ul className="space-y-1.5 text-sm text-amber-700">
            <li>• 3만원 이상 구매 시 1시간 무료</li>
            <li>• 5만원 이상 구매 시 2시간 무료</li>
            <li>• 할인은 당일 구매 영수증 제출 시 적용</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
