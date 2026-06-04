import { useState } from 'react'
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBigMoney } from '@/context/big-money-context'
import { useAuth } from '@/context/auth-context'
import { TypeToggle } from '@/components/calculator/type-toggle'
import { AmountDisplay } from '@/components/calculator/amount-display'
import { Numpad } from '@/components/calculator/numpad'
import { EntryMetaSheet } from '@/components/calculator/entry-meta-sheet'
import { formatMoney, parseDigitString } from '@/lib/money'
import type { MoneyEntryType } from '@/types/money'
import type { MoneyEntry } from '@/types/money'
import { Fonts, Spacing } from '@/constants/theme'

const MAX_INT_DIGITS = 10

export default function RecordScreen() {
  const { summary, handleCreated } = useBigMoney()
  const { signOut } = useAuth()

  const [type, setType] = useState<MoneyEntryType>('saving')
  const [digits, setDigits] = useState('0')
  const [sheetOpen, setSheetOpen] = useState(false)

  function handleType(next: MoneyEntryType) {
    setType(next)
    setDigits('0')
  }

  function handleKey(key: string) {
    setDigits(prev => {
      if (key === 'back') {
        if (prev.length <= 1) return '0'
        return prev.slice(0, -1)
      }
      if (prev === '0' && key !== '.') return key
      if (key === '.') {
        if (prev.includes('.')) return prev
        return prev + '.'
      }
      const [int, dec] = prev.split('.')
      if (dec !== undefined) {
        if (dec.length >= 2) return prev
        return prev + key
      }
      if (int.length >= MAX_INT_DIGITS) return prev
      return prev + key
    })
  }

  function handleRecord() {
    const amount = parseDigitString(digits)
    if (!amount || amount <= 0) return
    setSheetOpen(true)
  }

  function handleConfirmed(entry: MoneyEntry) {
    handleCreated(entry)
    setDigits('0')
    setSheetOpen(false)
  }

  const balance = summary.investable_balance
  const balanceColor = balance >= 0 ? '#059669' : '#ef4444'

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.balanceLabel}>available to invest</Text>
            <Text style={[styles.balanceAmount, { color: balanceColor }]}>
              {formatMoney(balance)}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Link href="/(app)/history" asChild>
              <Pressable style={styles.historyLink}>
                <Text style={styles.historyLinkText}>history →</Text>
              </Pressable>
            </Link>
            <Pressable onPress={signOut} style={styles.signOutButton}>
              <Text style={styles.signOutText}>sign out</Text>
            </Pressable>
          </View>
        </View>

        {/* Type Toggle */}
        <View style={styles.toggleRow}>
          <TypeToggle value={type} onChange={handleType} />
        </View>

        {/* Amount display */}
        <View style={styles.amountRow}>
          <AmountDisplay digits={digits} type={type} />
        </View>

        {/* Numpad */}
        <Numpad onKey={handleKey} />

        {/* Record button */}
        <View style={styles.recordRow}>
          <Pressable
            style={({ pressed }) => [
              styles.recordButton,
              pressed && styles.recordButtonPressed,
              parseDigitString(digits) <= 0 && styles.recordButtonDisabled,
            ]}
            onPress={handleRecord}
            disabled={parseDigitString(digits) <= 0}>
            <Text style={styles.recordButtonText}>record</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      {sheetOpen && (
        <EntryMetaSheet
          type={type}
          amount={parseDigitString(digits)}
          onConfirmed={handleConfirmed}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  headerLeft: {
    gap: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  balanceLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
    letterSpacing: 0.3,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: Fonts?.rounded ?? 'system-ui',
    letterSpacing: -0.5,
  },
  historyLink: {
    paddingVertical: 4,
  },
  historyLinkText: {
    fontSize: 13,
    color: '#374151',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
  signOutButton: {
    paddingVertical: 2,
  },
  signOutText: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
  toggleRow: {
    paddingHorizontal: Spacing.three,
  },
  amountRow: {
    paddingVertical: Spacing.four,
  },
  recordRow: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
  },
  recordButton: {
    height: 60,
    backgroundColor: '#111827',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonPressed: {
    opacity: 0.75,
  },
  recordButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  recordButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Fonts?.sans ?? 'system-ui',
    letterSpacing: 0.2,
  },
})
