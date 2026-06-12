import { prisma } from '@/lib/prisma'
import { login } from './actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supervisors = await prisma.supervisorMaster.findMany()
  const error = (await searchParams).error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold text-blue-800 border-b-4 border-blue-800 pb-2">
            Supervisor Login
          </h1>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form action={login} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Supervisor
            </label>
            <select 
              name="supervisorName" 
              required
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select your name...</option>
              {supervisors.map((s) => (
                <option key={s.id} value={s.supervisorName}>{s.supervisorName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Enter password (default: 123456)"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
