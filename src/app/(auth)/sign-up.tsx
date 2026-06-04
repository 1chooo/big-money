import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/auth-context'
import { Fonts, Spacing } from '@/constants/theme'

export default function SignUpScreen() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignUp() {
    if (!email.trim() || !password) {
      Alert.alert('Sign up', 'Please enter your email and a password.')
      return
    }
    if (password !== confirm) {
      Alert.alert('Sign up', 'Passwords do not match.')
      return
    }
    if (password.length < 6) {
      Alert.alert('Sign up', 'Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      // Call 1chooo.com sign-up API then sign in
      const res = await fetch('https://1chooo.com/api/auth/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error((body as { error?: string }).error ?? 'Sign up failed.')
      }
      // Auto sign-in after successful registration
      await signIn(email.trim().toLowerCase(), password)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign up failed.'
      Alert.alert('Sign up failed', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.brand}>big money</Text>
            <Text style={styles.subtitle}>create an account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="emailAddress"
                autoComplete="email"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="at least 6 characters"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>confirm password</Text>
              <TextInput
                style={styles.input}
                value={confirm}
                onChangeText={setConfirm}
                placeholder="repeat your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                textContentType="newPassword"
                autoComplete="new-password"
                onSubmitEditing={handleSignUp}
                returnKeyType="go"
              />
            </View>

            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={handleSignUp}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>create account</Text>
              )}
            </Pressable>
          </View>

          <Link href="/(auth)/sign-in" asChild>
            <Pressable>
              <Text style={styles.switchText}>
                already have an account?{' '}
                <Text style={styles.switchLink}>sign in</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    gap: Spacing.five,
  },
  header: {
    gap: 4,
  },
  brand: {
    fontSize: 28,
    fontWeight: '600',
    fontFamily: Fonts?.serif ?? 'serif',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: Fonts?.sans ?? 'system-ui',
  },
  form: {
    gap: Spacing.three,
  },
  field: {
    gap: Spacing.one,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
    letterSpacing: 0.3,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#ffffff',
    fontFamily: Fonts?.sans ?? 'system-ui',
  },
  button: {
    height: 44,
    backgroundColor: '#111827',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts?.sans ?? 'system-ui',
  },
  switchText: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    fontFamily: Fonts?.sans ?? 'system-ui',
  },
  switchLink: {
    color: '#374151',
    fontWeight: '600',
  },
})
