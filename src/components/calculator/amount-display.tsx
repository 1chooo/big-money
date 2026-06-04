import { StyleSheet, Text, View } from 'react-native'
import { MoneyEntryType } from '@/types/money'
import { ENTRY_TYPE_AMOUNT_COLOR, formatDigitString } from '@/lib/money'
import { Fonts } from '@/constants/theme'

interface AmountDisplayProps {
  digits: string
  type: MoneyEntryType
}

export function AmountDisplay({ digits, type }: AmountDisplayProps) {
  const formatted = formatDigitString(digits || '0')
  const color = ENTRY_TYPE_AMOUNT_COLOR[type]

  // Scale font size down for large numbers
  const len = formatted.replace(/[^0-9]/g, '').length
  const fontSize = len <= 4 ? 72 : len <= 7 ? 56 : len <= 10 ? 44 : 36

  return (
    <View style={styles.container}>
      <Text style={styles.currency}>$</Text>
      <Text style={[styles.amount, { color, fontSize }]}>{formatted}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  currency: {
    fontSize: 28,
    fontWeight: '300',
    color: '#9ca3af',
    fontFamily: Fonts?.sans ?? 'system-ui',
    marginRight: 4,
    paddingBottom: 4,
  },
  amount: {
    fontWeight: '700',
    fontFamily: Fonts?.rounded ?? 'system-ui',
    letterSpacing: -2,
  },
})
