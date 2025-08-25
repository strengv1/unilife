'use server'

import { redirect } from 'next/navigation'
import { checkPassword, createToken, verifyAuth, setAuthCookie, clearAuthCookie } from '@/app/lib/auth'

export async function loginAction(formData: FormData) {
  const password = formData.get('password') as string
  
  if (!checkPassword(password)) {
    return { error: 'Invalid password' }
  }
  
  const token = createToken()
  await setAuthCookie(token)
  
  return { success: true }
}

export async function logoutAction() {
  await clearAuthCookie()
  redirect('/admin')
}

export async function checkAuthAction() {
  const isAuthenticated = await verifyAuth()
  return { authenticated: isAuthenticated }
}
