import { supabase } from '@/lib/supabase' // ดึงตัวเชื่อมต่อมาใช้

export default async function Home() {
  // ดึงข้อมูลสินค้าจากตาราง products
  const { data: products, error } = await supabase
    .from('products')
    .select('*')

  // ถ้ามี error ให้แสดงข้อความ
  if (error) {
    console.error('Error fetching products:', error)
    return <div className="p-10 text-red-500">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">📦 รายการสินค้าคงคลัง</h1>
        
        {/* ตารางแสดงสินค้า */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">คงเหลือ</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-bold">{product.price} บาท</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* เช็คว่าของใกล้หมดหรือยัง */}
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stock_qty <= product.min_stock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {product.stock_qty} ชิ้น
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* ถ้าไม่มีสินค้าเลย */}
          {products.length === 0 && (
            <div className="p-6 text-center text-gray-500">ยังไม่มีสินค้าในระบบ</div>
          )}
        </div>
      </div>
    </div>
  )
}