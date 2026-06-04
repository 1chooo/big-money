import { StyleSheet, Text, View } from 'react-native'
import { MoneySummary } from '@/types/money'
import { formatMoney } from '@/lib/money'
import { Fonts, Spacing } from '@/constants/theme'

interface InvestableBalanceProps {
  summary: MoneySummary
}

export function InvestableBalance({ summary }: InvestableBalanceProps) {
  const { investable_balance, total_saved, total_overspent, total_invested } = summary
  const isPositive = investable_balance >= 0

  return (
    <View style={styles.card}>
      <Text style={styles.label}>available to invest</Text>
      <Text style={[styles.balance, { color: isPositive ? '#059669' : '#ef4444' }]}>
        {formatMoney(investable_balance)}
      </Text>

      <View style={styles.stats}>
        <StatItem label="saved" amount={total_saved} color="#059669" />
        <View style={styles.divider} />
        <StatItem label="overspent" amount={total_overspent} color="#ef4444" sign="-" />
        <View style={styles.divider} />
        <StatItem label="invested" amount={total_invested} color="#7c3aed" />
      </View>
    </View>
  )
}

function StatItem({
  label,
  amount,
  color,
  sign = '+',
}: {
  label: string
  amount: number
  color: string
  sign?: string
}) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statAmount, { color }]}>
        {sign}{formatMoney(amount)}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
    letterSpacing: 0.3,
  },
  balance: {
    fontSize: 36,
    fontWeight: '700',
    fontFamily: Fonts?.rounded ?? 'system-ui',
    letterSpacing: -1,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statAmount: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
  statLabel: {
    fontSize: 10,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: '#f3f4f6',
  },
})
