"use server"

import { prisma } from '@/lib/prisma'
import { encrypt, getSession } from '@/lib/auth'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const supervisorName = formData.get('supervisorName') as string
  const password = formData.get('password') as string

  if (!supervisorName || !password) {
    redirect('/login?error=Please provide both supervisor name and password')
  }

  const supervisor = await prisma.supervisorMaster.findUnique({
    where: { supervisorName }
  })

  if (!supervisor || supervisor.passwordHash !== password) {
    redirect('/login?error=Invalid credentials')
  }

  // Create session
  const sessionData = { 
    supervisorId: supervisor.id, 
    supervisorName: supervisor.supervisorName 
  }
  
  const encryptedSessionData = await encrypt(sessionData)
  
  ;(await cookies()).set('session', encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  })

  redirect('/')
}

export async function handleLogout() {
  (await cookies()).delete('session')
  redirect('/login')
}

export async function changePassword(prevState: any, formData: FormData) {
  const currentPassword = formData.get('currentPassword') as string
  const newPassword = formData.get('newPassword') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All fields are required' }
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match' }
  }

  const session = await getSession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const supervisor = await prisma.supervisorMaster.findUnique({
    where: { id: session.supervisorId }
  })

  if (!supervisor || supervisor.passwordHash !== currentPassword) {
    return { error: 'Incorrect current password' }
  }

  await prisma.supervisorMaster.update({
    where: { id: session.supervisorId },
    data: { passwordHash: newPassword }
  })

  return { success: 'Password changed successfully' }
}
