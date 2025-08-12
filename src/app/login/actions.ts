'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  console.log('🔍 Login action called');
  
  const supabase = await createClient()

  // Validate inputs
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  console.log('🔍 Login attempt for email:', email);

  if (!email || !password) {
    console.log('🔥 Missing email or password');
    redirect('/error?message=Missing email or password')
  }

  const data = {
    email,
    password,
  }

  console.log('🔍 Attempting Supabase sign in...');
  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('🔥 Login error:', error)
    redirect(`/error?message=${encodeURIComponent(error.message)}`)
  }

  console.log('🔍 Login successful, user:', authData.user?.id);
  console.log('🔍 Session:', authData.session?.access_token ? 'Present' : 'Missing');

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
        display_name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        initials: `${(formData.get('firstName') as string)[0]}${(formData.get('lastName') as string)[0]}`.toUpperCase(),
      },
    },
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function logout() {
  const supabase = await createClient()
  
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error('Logout error:', error)
    // Even if logout fails, we should still redirect
  }
  
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function loginAsGuest() {
  console.log('🔍 Guest login action called');
  
  const supabase = await createClient()
  
  try {
    // Sign in with your actual guest account credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'guest@demo.app', // Replace with your actual guest email
      password: 'guest-password-123' // Replace with your actual guest password
    })
    
    if (error) {
      console.error('🔥 Guest login error:', error)
      redirect(`/error?message=${encodeURIComponent('Guest mode temporarily unavailable')}`)
    }
    
    // Verify this is the correct guest user
    if (data.user?.id !== '55e3b0e6-b683-4cab-aa5b-6a5b192bde7d') {
      console.error('🔥 Wrong user ID for guest account')
      redirect(`/error?message=${encodeURIComponent('Guest account configuration error')}`)
    }
    
    console.log('🔍 Guest login successful');
    
  } catch (error) {
    console.error('🔥 Guest login failed:', error)
    redirect(`/error?message=${encodeURIComponent('Guest mode unavailable')}`)
  }
  
  // Success - redirect outside try/catch to avoid catching the redirect
  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
