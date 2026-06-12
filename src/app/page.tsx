import LogForm from '@/components/LogForm'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { handleLogout } from './login/actions'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const lines = await prisma.lineMaster.findMany()
  const operators = await prisma.operatorMaster.findMany()
  const skus = await prisma.sKUMaster.findMany()
  const materialItems = await prisma.materialItem.findMany()

  return (
    <main className="min-h-screen bg-gray-50 pb-8">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b px-6 py-3 flex justify-between items-center mb-8 print:hidden">
        <div className="font-bold text-gray-700 flex items-center space-x-6">
          <span>Welcome, <span className="text-blue-600">{session.supervisorName}</span></span>
          <div className="h-6 w-px bg-gray-300"></div>
          <nav className="flex space-x-4">
            <Link href="/" className="text-blue-600 font-medium border-b-2 border-blue-600">New Form</Link>
            <Link href="/logs" className="text-gray-500 hover:text-blue-600 font-medium">Order History</Link>
          </nav>
        </div>
        <form action={handleLogout}>
          <button type="submit" className="text-sm bg-red-50 text-red-600 px-4 py-1.5 rounded border border-red-200 hover:bg-red-100 transition">
            Logout
          </button>
        </form>
      </header>

      <div className="bg-white max-w-7xl mx-auto shadow-sm border border-gray-300">
        <LogForm lines={lines} operators={operators} skus={skus} materialItems={materialItems} />
      </div>
    </main>
  )
}
