import { Redirect } from 'expo-router'
import { useAuth } from '@/context/auth-context'
import { BigMoneyProvider } from '@/context/big-money-context'
import AppTabs from '@/components/app-tabs'

export default function AppLayout() {
  const { session, loading } = useAuth()

  if (loading) return null
  if (!session) return <Redirect href="/(auth)/sign-in" />

  return (
    <BigMoneyProvider>
      <AppTabs />
    </BigMoneyProvider>
  )
}
