import { Pressable, StyleSheet, Text, View } from 'react-native'
import * as Haptics from 'expo-haptics'
import { Fonts, Spacing } from '@/constants/theme'

type NumpadKey = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '.' | 'back'

const KEYS: NumpadKey[][] = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'back'],
]

interface NumpadProps {
  onKey: (key: NumpadKey) => void
}

export function Numpad({ onKey }: NumpadProps) {
  function handlePress(key: NumpadKey) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    onKey(key)
  }

  return (
    <View style={styles.grid}>
      {KEYS.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map(key => (
            <Pressable
              key={key}
              style={({ pressed }) => [styles.key, pressed && styles.keyPressed]}
              onPressIn={() => handlePress(key)}>
              <Text style={styles.keyText}>
                {key === 'back' ? '⌫' : key}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.one,
  },
  key: {
    flex: 1,
    height: 72,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  keyPressed: {
    backgroundColor: '#e5e7eb',
  },
  keyText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#111827',
    fontFamily: Fonts?.rounded ?? 'system-ui',
  },
})
