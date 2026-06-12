"use server"

import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'
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
