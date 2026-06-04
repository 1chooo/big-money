import { Redirect } from 'expo-router'
import { useAuth } from '@/context/auth-context'

export default function Root() {
  const { session, loading } = useAuth()
  if (loading) return null
  if (session) return <Redirect href="/(app)/" />
  return <Redirect href="/(auth)/sign-in" />
}
