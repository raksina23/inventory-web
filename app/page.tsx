'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  AlertTriangle 
} from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({
    todaySales: 0,
    totalOrders: 0,
    lowStockCount: 0,
    productsCount: 0
  })
  const [loading, setLoading] = useState(true)

  // ฟังก์ชันดึงข้อมูลจาก Supabase
  const fetchStats = async () => {
    try {
      setLoading(true)
      
      // 1. หาวันที่ปัจจุบัน (YYYY-MM-DD) เพื่อดึงยอดขาย "เฉพาะวันนี้"
      const today = new Date().toISOString().split('T')[0] 

      // --- ดึงยอดขายวันนี้ (จากตาราง orders) ---
      // สมมติว่าตาราง orders มี column: created_at, total_price
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', today + 'T00:00:00') // ตั้งแต่เที่ยงคืน
        .lte('created_at', today + 'T23:59:59') // ถึงก่อนเที่ยงคืนวันถัดไป

      if (orderError) throw orderError

      // คำนวณยอดรวม
      const totalSales = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      
      // --- ดึงข้อมูลสินค้า (จากตาราง products) ---
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('stock_qty')
      
      if (prodError) throw prodError

      // นับสินค้าที่เหลือน้อยกว่า 5 ชิ้น
      const lowStock = products.filter(p => p.stock_qty < 5).length

      setStats({
        todaySales: totalSales,
        totalOrders: orders.length,
        lowStockCount: lowStock,
        productsCount: products.length
      })

    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      
      {/* --- Header --- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">แดชบอร์ดภาพรวม</h1>
          <p className="text-gray-500">ยินดีต้อนรับกลับสู่ระบบจัดการร้านของคุณ</p>
        </div>
        <button 
          onClick={fetchStats} 
          className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm transition"
        >
          🔄 รีเฟรชข้อมูล
        </button>
      </div>

      {/* --- Cards แสดงผล (Grid) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: ยอดขายวันนี้ */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">ยอดขายวันนี้</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? '...' : `฿${stats.todaySales.toLocaleString()}`}
            </h3>
          </div>
        </div>

        {/* Card 2: จำนวนบิล */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">บิลขายวันนี้</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? '...' : `${stats.totalOrders} รายการ`}
            </h3>
          </div>
        </div>

        {/* Card 3: สินค้าทั้งหมด */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">สินค้าทั้งหมด</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {loading ? '...' : `${stats.productsCount} รายการ`}
            </h3>
          </div>
        </div>

        {/* Card 4: สินค้าใกล้หมด (แจ้งเตือน) */}
        <div className={`p-6 rounded-xl shadow-sm border flex items-center space-x-4 ${stats.lowStockCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-100'}`}>
          <div className={`p-3 rounded-full ${stats.lowStockCount > 0 ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className={`text-sm ${stats.lowStockCount > 0 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
              สินค้าใกล้หมด
            </p>
            <h3 className={`text-2xl font-bold ${stats.lowStockCount > 0 ? 'text-red-700' : 'text-gray-800'}`}>
              {loading ? '...' : `${stats.lowStockCount} รายการ`}
            </h3>
          </div>
        </div>
      </div>

      {/* --- เมนูลัด (Quick Actions) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* กล่องซ้าย: ไปขายของ */}
        <Link href="/pos" className="group relative block h-40 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden">
          <div className="relative z-10 text-white">
            <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <ShoppingCart /> ไปหน้าขายสินค้า (POS)
            </h3>
            <p className="text-blue-100">เข้าสู่โหมดแคชเชียร์ สแกนบาร์โค้ดเพื่อขาย</p>
          </div>
          {/* ตกแต่งพื้นหลัง */}
          <ShoppingCart className="absolute -bottom-4 -right-4 text-white opacity-20 w-32 h-32 transform -rotate-12 group-hover:scale-110 transition" />
        </Link>

        {/* กล่องขวา: จัดการสต็อก */}
        <Link href="/products" className="group relative block h-40 bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-blue-500 hover:bg-blue-50 transition-all text-gray-600 hover:text-blue-600">
           <div className="flex flex-col items-center justify-center h-full gap-2">
              <Package size={32} />
              <span className="text-lg font-semibold">จัดการสต็อก / เพิ่มสินค้า</span>
           </div>
        </Link>

      </div>
    </div>
  )
}