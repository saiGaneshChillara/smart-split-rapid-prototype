import { PropsWithChildren } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";

type ScreenProps = PropsWithChildren;

export const Screen = ({ children }: ScreenProps) => {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
  },
});