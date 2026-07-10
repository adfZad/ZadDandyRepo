import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { handleLogout } from '../login/actions'
import ChangePasswordButton from '@/components/ChangePasswordButton'

export const dynamic = 'force-dynamic'

export default async function LogsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const logs = await prisma.operationLog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      line: true,
      sku: true,
      operator: true,
    }
  })

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center mb-8">
        <div className="font-bold text-gray-700 flex items-center space-x-6">
          <span>Welcome, <span className="text-blue-600">{session.supervisorName}</span></span>
          <div className="h-6 w-px bg-gray-300"></div>
          <nav className="flex space-x-4">
            <Link href="/" className="text-gray-500 hover:text-blue-600 font-medium">New Form</Link>
            <Link href="/logs" className="text-blue-600 font-medium border-b-2 border-blue-600">Order History</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <ChangePasswordButton />
          <form action={handleLogout}>
            <button type="submit" className="text-sm bg-red-50 text-red-600 px-4 py-1.5 rounded border border-red-200 hover:bg-red-100 transition">
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Submitted Order Logs</h1>
        
        <div className="bg-white shadow-sm border border-gray-300 rounded overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="p-3 text-left font-semibold text-gray-700">Date</th>
                <th className="p-3 text-left font-semibold text-gray-700">Line</th>
                <th className="p-3 text-left font-semibold text-gray-700">SKU</th>
                <th className="p-3 text-left font-semibold text-gray-700">Operator</th>
                <th className="p-3 text-left font-semibold text-gray-700">Batch Code</th>
                <th className="p-3 text-right font-semibold text-gray-700">Run Hrs</th>
                <th className="p-3 text-right font-semibold text-gray-700">Packed Qty</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 text-gray-800">{new Date(log.productionDate).toLocaleDateString()}</td>
                  <td className="p-3 text-gray-800">{log.line.lineName}</td>
                  <td className="p-3 text-gray-800">{log.sku.productDescription}</td>
                  <td className="p-3 text-gray-800">{log.operator.operator}</td>
                  <td className="p-3 text-gray-800">{log.batchCode}</td>
                  <td className="p-3 text-right text-gray-800">{log.totalRunHours || '-'}</td>
                  <td className="p-3 text-right font-medium text-gray-800">{log.packedQty || '-'}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-500">No logs submitted yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
