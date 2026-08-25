import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { colors, spacing } from "../theme";
import { AppText } from "./AppText";
import App from "../../App";

type Props = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
};

export type OtpInputHandle = {
  focus: () => void;
};

export const OtpInput = forwardRef<OtpInputHandle, Props>(
  ({ value, onChange, length = 6 }, ref) => {
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

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
  }
);

OtpInput.displayName = "OtpInput";

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