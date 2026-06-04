import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { MoneyEntry } from '@/types/money'
import { formatEntryDate, groupEntriesByDate } from '@/lib/money'
import { EntryRow } from './entry-row'
import { Fonts, Spacing } from '@/constants/theme'

interface EntriesFeedProps {
  entries: MoneyEntry[]
  loading: boolean
  onDeleted: (id: string) => void
}

export function EntriesFeed({ entries, loading, onDeleted }: EntriesFeedProps) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#9ca3af" />
      </View>
    )
  }

  if (entries.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>no entries yet</Text>
        <Text style={styles.emptyHint}>record your first saving, overspend, or investment</Text>
      </View>
    )
  }

  const groups = groupEntriesByDate(entries)

  return (
    <View style={styles.feed}>
      {groups.map(({ date, entries: dayEntries }) => (
        <View key={date} style={styles.group}>
          <Text style={styles.dateLabel}>{formatEntryDate(date)}</Text>
          <View style={styles.rows}>
            {dayEntries.map(entry => (
              <EntryRow key={entry.id} entry={entry} onDeleted={onDeleted} />
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  feed: {
    gap: Spacing.four,
  },
  group: {
    gap: Spacing.two,
  },
  dateLabel: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  rows: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    gap: 0,
  },
  center: {
    paddingVertical: Spacing.six,
    alignItems: 'center',
    gap: Spacing.two,
  },
  emptyTitle: {
    fontSize: 15,
    color: '#374151',
    fontFamily: Fonts?.sans ?? 'system-ui',
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
    textAlign: 'center',
    maxWidth: 240,
  },
})
