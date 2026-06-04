import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import { MoneyEntry } from '@/types/money'
import {
  ENTRY_TYPE_COLORS,
  ENTRY_TYPE_LABELS,
  ENTRY_TYPE_SIGN,
  formatMoney,
} from '@/lib/money'
import { deleteMoneyEntry } from '@/lib/api'
import { Fonts, Spacing } from '@/constants/theme'

interface EntryRowProps {
  entry: MoneyEntry
  onDeleted: (id: string) => void
}

export function EntryRow({ entry, onDeleted }: EntryRowProps) {
  const colors = ENTRY_TYPE_COLORS[entry.type]
  const sign = ENTRY_TYPE_SIGN[entry.type]

  function handleDelete() {
    Alert.alert(
      'Delete entry',
      `Remove this ${ENTRY_TYPE_LABELS[entry.type]} of ${formatMoney(entry.amount)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMoneyEntry(entry.id)
              onDeleted(entry.id)
            } catch {
              Alert.alert('Error', 'Failed to delete entry.')
            }
          },
        },
      ]
    )
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onLongPress={handleDelete}>
      {/* Badge */}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.bg,
            borderColor: colors.border,
          },
        ]}>
        <Text style={[styles.badgeText, { color: colors.text }]}>
          {ENTRY_TYPE_LABELS[entry.type]}
        </Text>
      </View>

      {/* Description */}
      <View style={styles.meta}>
        <Text style={styles.description} numberOfLines={1}>
          {entry.description ?? ENTRY_TYPE_LABELS[entry.type]}
        </Text>
        <View style={styles.metaRow}>
          {entry.category && (
            <Text style={styles.category}>{entry.category}</Text>
          )}
          {entry.symbol && (
            <View style={styles.symbolPill}>
              <Text style={styles.symbolText}>{entry.symbol}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Amount */}
      <Text style={[styles.amount, { color: colors.text }]}>
        {sign === '-' ? '−' : '+'}{formatMoney(entry.amount)}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  rowPressed: {
    opacity: 0.6,
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  description: {
    fontSize: 14,
    color: '#111827',
    fontFamily: Fonts?.sans ?? 'system-ui',
    fontWeight: '400',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  category: {
    fontSize: 11,
    color: '#9ca3af',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
  symbolPill: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  symbolText: {
    fontSize: 10,
    color: '#374151',
    fontFamily: Fonts?.mono ?? 'monospace',
    fontWeight: '600',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
})
