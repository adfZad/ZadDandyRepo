"use client"

import { useState } from 'react'
import { changePassword } from '@/app/login/actions'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsPending(true)

    const formData = new FormData(e.currentTarget)
    const result = await changePassword(null, formData)

    setIsPending(false)
    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
      setTimeout(() => {
        onClose()
        setSuccess(null)
      }, 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/40 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Change Password</h2>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300"
              placeholder="Enter current password"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 ml-1">New Password</label>
            <input 
              type="password" 
              name="newPassword"
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300"
              placeholder="Enter new password"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700 ml-1">Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-2.5 outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10 transition-all duration-300"
              placeholder="Confirm new password"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-200 transition-colors duration-300"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isPending || !!success}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all duration-300 active:scale-[0.98] disabled:opacity-70"
            >
              {isPending ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
