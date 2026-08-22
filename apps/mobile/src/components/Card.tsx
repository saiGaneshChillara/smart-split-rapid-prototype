import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { colors, spacing } from "../theme";

type CardProps = PropsWithChildren<{
  style?: ViewStyle | ViewStyle[];
}>;

export const Card = ({ children, style }: CardProps) => {
  return (
    <View
      style={[styles.card, style]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,

    borderRadius: 16,

    padding: spacing.lg,

    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },
});