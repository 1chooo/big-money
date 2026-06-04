import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { LinearGradient } from 'expo-linear-gradient'
import { MoneySummary } from '@/types/money'
import { formatMoney } from '@/lib/money'
import { Fonts, Spacing } from '@/constants/theme'

interface TotalsBreakdownProps {
  summary: MoneySummary
}

export function TotalsBreakdown({ summary }: TotalsBreakdownProps) {
  const { width } = useWindowDimensions()
  const { total_saved, total_overspent, total_invested } = summary

  const barData = [
    ...(total_saved > 0
      ? [{ value: total_saved, label: 'saved', frontColor: '#059669', topLabelComponent: () => null }]
      : []),
    ...(total_overspent > 0
      ? [{ value: total_overspent, label: 'overspent', frontColor: '#ef4444', topLabelComponent: () => null }]
      : []),
    ...(total_invested > 0
      ? [{ value: total_invested, label: 'invested', frontColor: '#7c3aed', topLabelComponent: () => null }]
      : []),
  ]

  if (barData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>totals breakdown</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>no data yet</Text>
        </View>
      </View>
    )
  }

  const chartWidth = width - Spacing.four * 2 - 32
  const barWidth = Math.min(60, (chartWidth - 40) / barData.length - 16)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>totals breakdown</Text>

      <BarChart
        data={barData}
        width={chartWidth}
        height={140}
        barWidth={barWidth}
        barBorderRadius={6}
        xAxisColor="#f3f4f6"
        yAxisColor="#f3f4f6"
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        rulesColor="#f9fafb"
        noOfSections={4}
        spacing={Math.max(20, (chartWidth - barData.length * barWidth) / (barData.length + 1))}
        initialSpacing={16}
        LinearGradient={LinearGradient}
        formatYLabel={(v: string) => {
          const n = parseFloat(v)
          if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`
          return `$${n.toFixed(0)}`
        }}
      />

      {/* Legend */}
      <View style={styles.legend}>
        {total_saved > 0 && <LegendItem color="#059669" label="saved" amount={total_saved} />}
        {total_overspent > 0 && <LegendItem color="#ef4444" label="overspent" amount={total_overspent} />}
        {total_invested > 0 && <LegendItem color="#7c3aed" label="invested" amount={total_invested} />}
      </View>
    </View>
  )
}

function LegendItem({
  color,
  label,
  amount,
}: {
  color: string
  label: string
  amount: number
}) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
      <Text style={[styles.legendAmount, { color }]}>{formatMoney(amount)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: Spacing.four,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    gap: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  title: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
    letterSpacing: 0.3,
  },
  axisText: {
    fontSize: 9,
    color: '#d1d5db',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
  legend: {
    gap: Spacing.two,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: Fonts?.mono ?? 'monospace',
    flex: 1,
  },
  legendAmount: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
  empty: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
})
