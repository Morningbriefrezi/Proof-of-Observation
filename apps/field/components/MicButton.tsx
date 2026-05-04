import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
  type GestureResponderEvent,
} from 'react-native';

type Props = {
  isRecording: boolean;
  durationMs: number;
  disabled?: boolean;
  busy?: boolean;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
};

function formatDuration(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function MicButton({
  isRecording,
  durationMs,
  disabled,
  busy,
  onPressIn,
  onPressOut,
}: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRecording) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.18,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isRecording, pulse]);

  return (
    <View style={styles.wrap}>
      <Pressable
        disabled={disabled || busy}
        onPressIn={(e) => {
          Animated.spring(press, { toValue: 0.94, useNativeDriver: true }).start();
          onPressIn?.(e);
        }}
        onPressOut={(e) => {
          Animated.spring(press, { toValue: 1, useNativeDriver: true }).start();
          onPressOut?.(e);
        }}
      >
        {isRecording && (
          <Animated.View
            style={[
              styles.ring,
              {
                transform: [{ scale: pulse }],
                opacity: pulse.interpolate({
                  inputRange: [1, 1.18],
                  outputRange: [0.6, 0.15],
                }),
              },
            ]}
          />
        )}
        <Animated.View
          style={[
            styles.button,
            isRecording ? styles.buttonActive : null,
            disabled || busy ? styles.buttonDisabled : null,
            { transform: [{ scale: press }] },
          ]}
        >
          <Text style={styles.icon}>●</Text>
        </Animated.View>
      </Pressable>

      <Text style={styles.label}>
        {busy
          ? 'Transcribing…'
          : isRecording
            ? `Recording  ${formatDuration(durationMs)}`
            : disabled
              ? 'Loading recognizer…'
              : 'Hold to record'}
      </Text>
    </View>
  );
}

const SIZE = 124;
const RING = 168;

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 14, paddingVertical: 20 },
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: '#14B8A6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#0B0E17',
    shadowColor: '#14B8A6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 6,
  },
  buttonActive: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
  },
  buttonDisabled: {
    backgroundColor: '#1A1F2E',
    shadowOpacity: 0,
  },
  ring: {
    position: 'absolute',
    top: -(RING - SIZE) / 2,
    left: -(RING - SIZE) / 2,
    width: RING,
    height: RING,
    borderRadius: RING / 2,
    backgroundColor: '#EF444433',
    borderWidth: 1,
    borderColor: '#EF444466',
  },
  icon: { color: '#FFFFFF', fontSize: 36, lineHeight: 40 },
  label: {
    color: '#9CA3AF',
    fontSize: 13,
    letterSpacing: 0.5,
    fontVariant: ['tabular-nums'],
  },
});
