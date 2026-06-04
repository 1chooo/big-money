import { useMemo } from 'react'
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import { LineChart } from 'react-native-gifted-charts'
import { LinearGradient } from 'expo-linear-gradient'
import { MoneyEntry } from '@/types/money'
import { Fonts, Spacing } from '@/constants/theme'

interface BalanceOverTimeProps {
  entries: MoneyEntry[]
}

export function BalanceOverTime({ entries }: BalanceOverTimeProps) {
  const { width } = useWindowDimensions()

  const { chartData, latestBalance } = useMemo(() => {
    if (entries.length === 0) return { chartData: [], latestBalance: 0 }

    const byDate = new Map<string, { saved: number; overspent: number; invested: number }>()

    for (const e of entries) {
      const day = e.recorded_at
      if (!byDate.has(day)) byDate.set(day, { saved: 0, overspent: 0, invested: 0 })
      const d = byDate.get(day)!
      if (e.type === 'saving') d.saved += Number(e.amount)
      if (e.type === 'overspend') d.overspent += Number(e.amount)
      if (e.type === 'investment') d.invested += Number(e.amount)
    }

    const sorted = Array.from(byDate.entries()).sort((a, b) => a[0].localeCompare(b[0]))

    let running = 0
    const data = sorted.map(([date, d]) => {
      running += d.saved - d.overspent - d.invested
      return { value: running, label: date.slice(5) }
    })

    return { chartData: data, latestBalance: running }
  }, [entries])

  if (chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>balance over time</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>no entries yet</Text>
        </View>
      </View>
    )
  }

  const isPositive = latestBalance >= 0
  const lineColor = isPositive ? '#059669' : '#ef4444'
  const gradientColors = isPositive
    ? (['#ecfdf5', '#ffffff'] as const)
    : (['#fef2f2', '#ffffff'] as const)
  const chartWidth = width - Spacing.four * 2 - 32
  const spacing = Math.max(20, Math.min(60, (chartWidth - 40) / Math.max(chartData.length - 1, 1)))

  return (
    <View style={styles.container}>
      <Text style={styles.title}>balance over time</Text>
      <LineChart
        data={chartData}
        width={chartWidth}
        height={160}
        color={lineColor}
        thickness={2}
        areaChart
        curved
        hideDataPoints
        startFillColor={gradientColors[0]}
        endFillColor={gradientColors[1]}
        startOpacity={0.5}
        endOpacity={0.05}
        linearGradient
        LinearGradient={LinearGradient}
        xAxisColor="#f3f4f6"
        yAxisColor="#f3f4f6"
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.axisText}
        rulesColor="#f9fafb"
        noOfSections={4}
        spacing={spacing}
        initialSpacing={8}
        formatYLabel={(v: string) => {
          const n = parseFloat(v)
          if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}k`
          return `$${n.toFixed(0)}`
        }}
      />
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
  empty: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
})
