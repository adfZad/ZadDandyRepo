import { prisma } from '@/lib/prisma'
import { login } from './actions'

export const dynamic = 'force-dynamic'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supervisors = await prisma.supervisorMaster.findMany()
  const error = (await searchParams).error

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-100 p-4">
      <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 relative overflow-hidden">
        
        {/* Subtle decorative background blob */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="flex flex-col items-center mb-8 relative z-10">
          <img src="/dandy-logo.jpeg" alt="Dandy Logo" className="h-20 mb-5 object-contain rounded-xl shadow-sm bg-white p-2 border border-gray-100" />
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-indigo-600">
            Supervisor Portal
          </h1>
          <p className="text-sm text-gray-500 mt-2 font-medium">Sign in to access operation logs</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-semibold animate-pulse shadow-sm relative z-10">
            {error}
          </div>
        )}
        
        <form action={login} className="space-y-6 relative z-10">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 ml-1">
              Select Supervisor
            </label>
            <div className="relative">
              <select 
                name="supervisorName" 
                required
                defaultValue=""
                className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 appearance-none cursor-pointer font-medium shadow-sm"
              >
                <option value="" disabled>Select your name...</option>
                {supervisors.map((s) => (
                  <option key={s.id} value={s.supervisorName}>{s.supervisorName}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 ml-1">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 font-medium shadow-sm"
              placeholder="Enter password"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:from-blue-700 hover:to-indigo-800 transform hover:-translate-y-0.5 transition-all duration-200 mt-2"
          >
            Secure Login
          </button>
        </form>
      </div>
    </div>
  )
}
