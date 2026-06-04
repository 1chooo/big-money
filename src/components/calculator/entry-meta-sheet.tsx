import { useCallback, useMemo, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { MoneyEntryType } from '@/types/money'
import {
  CATEGORIES_BY_TYPE,
  ENTRY_TYPE_COLORS,
  ENTRY_TYPE_LABELS,
} from '@/lib/money'
import { createMoneyEntry } from '@/lib/api'
import { Fonts, Spacing } from '@/constants/theme'
import type { MoneyEntry } from '@/types/money'

interface EntryMetaSheetProps {
  type: MoneyEntryType
  amount: number
  onConfirmed: (entry: MoneyEntry) => void
  onClose: () => void
}

function todayString() {
  return new Date().toISOString().slice(0, 10)
}

export function EntryMetaSheet({
  type,
  amount,
  onConfirmed,
  onClose,
}: EntryMetaSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['60%', '85%'], [])

  const [note, setNote] = useState('')
  const [category, setCategory] = useState('')
  const [date, setDate] = useState(todayString())
  const [symbol, setSymbol] = useState('')
  const [loading, setLoading] = useState(false)

  const colors = ENTRY_TYPE_COLORS[type]
  const categories = CATEGORIES_BY_TYPE[type]

  const handleClose = useCallback(() => {
    bottomSheetRef.current?.close()
    onClose()
  }, [onClose])

  async function handleRecord() {
    Keyboard.dismiss()
    setLoading(true)
    try {
      const { entry } = await createMoneyEntry({
        type,
        amount,
        description: note.trim() || null,
        category: category || null,
        symbol: type === 'investment' && symbol.trim() ? symbol.trim().toUpperCase() : null,
        recorded_at: date,
      })
      onConfirmed(entry)
      handleClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record entry.'
      Alert.alert('Error', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={styles.sheetBg}
      handleIndicatorStyle={styles.handle}>
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.typeBadge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
            <Text style={[styles.typeBadgeText, { color: colors.text }]}>
              {ENTRY_TYPE_LABELS[type]}
            </Text>
          </View>
          <Text style={styles.amountPreview}>
            ${amount.toFixed(2)}
          </Text>
        </View>

        {/* Note */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>note (optional)</Text>
          <TextInput
            style={styles.input}
            value={note}
            onChangeText={setNote}
            placeholder="add a note…"
            placeholderTextColor="#9ca3af"
            multiline={false}
            returnKeyType="done"
          />
        </View>

        {/* Category */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chips}>
            {categories.map(cat => (
              <Pressable
                key={cat}
                style={[
                  styles.chip,
                  category === cat && {
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setCategory(prev => (prev === cat ? '' : cat))}>
                <Text
                  style={[
                    styles.chipText,
                    category === cat && { color: colors.text },
                  ]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Symbol (investment only) */}
        {type === 'investment' && (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>ticker symbol (optional)</Text>
            <TextInput
              style={styles.input}
              value={symbol}
              onChangeText={setSymbol}
              placeholder="e.g. AAPL, BTC"
              placeholderTextColor="#9ca3af"
              autoCapitalize="characters"
              returnKeyType="done"
            />
          </View>
        )}

        {/* Date */}
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>date</Text>
          <TextInput
            style={styles.input}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
            keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
            returnKeyType="done"
          />
        </View>

        {/* Record button */}
        <Pressable
          style={({ pressed }) => [
            styles.recordButton,
            { backgroundColor: colors.text },
            pressed && styles.recordButtonPressed,
          ]}
          onPress={handleRecord}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.recordButtonText}>
              record {ENTRY_TYPE_LABELS[type]}
            </Text>
          )}
        </Pressable>

        {/* Cancel */}
        <Pressable style={styles.cancelButton} onPress={handleClose}>
          <Text style={styles.cancelText}>cancel</Text>
        </Pressable>
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

const styles = StyleSheet.create({
  sheetBg: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: '#d1d5db',
    width: 40,
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.three,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  typeBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
  },
  amountPreview: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    fontFamily: Fonts?.rounded ?? 'system-ui',
    letterSpacing: -0.5,
  },
  field: {
    gap: Spacing.one,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6b7280',
    fontFamily: Fonts?.mono ?? 'monospace',
    textTransform: 'lowercase',
    letterSpacing: 0.3,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#fafafa',
    fontFamily: Fonts?.sans ?? 'system-ui',
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingVertical: 2,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  chipText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: Fonts?.mono ?? 'monospace',
  },
  recordButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  recordButtonPressed: {
    opacity: 0.8,
  },
  recordButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans ?? 'system-ui',
  },
  cancelButton: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 14,
    color: '#9ca3af',
    fontFamily: Fonts?.sans ?? 'system-ui',
  },
})
