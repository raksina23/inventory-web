import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic' // ใช้สำหรับการดึงข้อมูลแบบ dynamic
export const revalidate = 0 // ไม่ต้องการ caching

export default async function Home() {
  // ดึงข้อมูลสินค้าจาก Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('name', { ascending: true }) // เรียงตามชื่อ

  if (error) {
    return <div className="p-10 text-red-500">เกิดข้อผิดพลาด: {error.message}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">คลังสินค้า (Stock)</h1>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            + เพิ่มสินค้า
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บาร์โค้ด</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ราคาขาย</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">คงเหลือ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products?.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {product.barcode || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-green-600 font-bold">
                    {Number(product.price).toLocaleString()} บาท
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock_qty <= product.min_stock 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock_qty} ชิ้น
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {(!products || products.length === 0) && (
            <div className="p-10 text-center text-gray-500">
              ยังไม่มีสินค้าในระบบ
            </div>
          )}
        </div>
      </div>
    </div>
  )
}