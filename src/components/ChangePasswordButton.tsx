"use client"

import { useState } from 'react'
import ChangePasswordModal from './ChangePasswordModal'

export default function ChangePasswordButton() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="text-sm bg-gray-50 text-gray-600 px-4 py-1.5 rounded border border-gray-200 hover:bg-gray-100 hover:text-gray-800 transition font-medium"
      >
        Change Password
      </button>
      
      <ChangePasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}
