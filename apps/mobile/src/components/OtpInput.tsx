import { useEffect, useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors, spacing } from "../theme";
import { AppText } from "./AppText";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export const OtpInput = ({
  value,
  onChange,
  length = 6
}: Props) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 200);

    return () => clearTimeout(timeout);
  }, []);

  const handlePress = () => {
    if (inputRef.current?.isFocused()) {
      inputRef.current.blur();
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <View>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={(text) => {
          onChange(text.replace(/\D/g, ""))
        }}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus
        blurOnSubmit={false}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        caretHidden
        style={styles.hiddenInput}
      />

      <Pressable onPress={handlePress}>
        <View style={styles.container}>
          {Array.from({ length }).map((_, index) => {
            const digit = value[index] ?? "";

            const isActive = value.length === index || (value.length === length && index === length - 1);

            return (
              <View
                key={index}
                style={[
                  styles.cell,
                  isActive && styles.activeCell,
                ]}
              >
                <AppText variant="heading">
                  {digit}
                </AppText>
              </View>
            );
          })}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  hiddenInput: {
    position: "absolute",
    opacity: 0,
    width: 1,
    height: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  cell: {
    width: 48,
    height: 56,

    borderRadius: 12,

    borderWidth: 1,
    borderColor: colors.border,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: colors.white,
  },
  activeCell: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
});