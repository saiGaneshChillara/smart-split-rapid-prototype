import { forwardRef, ReactNode } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { colors, spacing, typography } from "../theme";
import { AppText } from "./AppText";

type AppTextInputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftElement?: ReactNode;
};

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(
  ({ label, error, leftElement, ...props }, ref) => {
    return (
      <View style={styles.wrapper}>
        {label && (
          <AppText
            variant="body"
            style={styles.label}
          >
            {label}
          </AppText>
        )}
        <View 
          style={[
            styles.container,
            error && styles.errorBorder,
          ]}
        >
          {leftElement}
          <TextInput
            ref={ref}
            placeholderTextColor={colors.textSecondary}
            style={styles.input}
            {...props}
          />
        </View>
        {error && (
          <AppText
            variant="caption"
            color={colors.error}
            style={styles.errorText}
          >
            {error}
          </AppText>
        )}
      </View>
    );
  }
);

AppTextInput.displayName = "AppTextInput";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  wrapper: {
    width: "100%",
  },
  label: {
    marginBottom: spacing.sm,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  errorText: {
    marginTop: spacing.xs,
  },
});