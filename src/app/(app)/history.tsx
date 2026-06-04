import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native'
import { Link } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBigMoney } from '@/context/big-money-context'
import { InvestableBalance } from '@/components/history/investable-balance'
import { BalanceOverTime } from '@/components/history/balance-over-time'
import { TotalsBreakdown } from '@/components/history/totals-breakdown'
import { EntriesFeed } from '@/components/history/entries-feed'
import { Fonts, Spacing } from '@/constants/theme'

export default function HistoryScreen() {
  const { entries, summary, loading, handleDeleted } = useBigMoney()

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Page header */}
        <View style={styles.header}>
          <Text style={styles.title}>history</Text>
          <Link href="/(app)/" asChild>
            <Pressable>
              <Text style={styles.backLink}>← record</Text>
            </Pressable>
          </Link>
        </View>

        {/* Investable balance hero */}
        <InvestableBalance summary={summary} />

        {/* Balance over time chart */}
        <BalanceOverTime entries={entries} />

        {/* Totals breakdown chart */}
        <TotalsBreakdown summary={summary} />

        {/* Entry feed */}
        <EntriesFeed entries={entries} loading={loading} onDeleted={handleDeleted} />
      </ScrollView>
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
  content: {
    padding: Spacing.four,
    paddingBottom: 120,
    gap: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.two,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    fontFamily: Fonts?.serif ?? 'serif',
    letterSpacing: -0.5,
  },
  backLink: {
    fontSize: 13,
    color: '#6b7280',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
})
