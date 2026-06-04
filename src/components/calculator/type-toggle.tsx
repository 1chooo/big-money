import { Pressable, StyleSheet, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { MoneyEntryType } from '@/types/money'
import { ENTRY_TYPE_LABELS } from '@/lib/money'
import { Fonts, Spacing } from '@/constants/theme'

const TYPES: MoneyEntryType[] = ['saving', 'overspend', 'investment']

interface TypeToggleProps {
  value: MoneyEntryType
  onChange: (type: MoneyEntryType) => void
}

export function TypeToggle({ value, onChange }: TypeToggleProps) {
  function handlePress(type: MoneyEntryType) {
    if (type === value) return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onChange(type)
  }

  return (
    <View style={styles.container}>
      {TYPES.map(type => (
        <Pressable
          key={type}
          style={[styles.segment, value === type && styles.segmentActive]}
          onPress={() => handlePress(type)}>
          <Text style={[styles.label, value === type && styles.labelActive]}>
            {ENTRY_TYPE_LABELS[type]}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentActive: {
    backgroundColor: '#111827',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
  },
  labelActive: {
    color: '#ffffff',
  },
})
