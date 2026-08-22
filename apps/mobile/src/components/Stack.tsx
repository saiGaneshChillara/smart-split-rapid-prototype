import { PropsWithChildren } from "react";
import { spacing } from "../theme";
import { StyleSheet, View, ViewStyle } from "react-native";

type StackSpacing = keyof typeof spacing;

type StackProps = PropsWithChildren<{
  spacing?: StackSpacing;
  style?: ViewStyle | ViewStyle[];
}>;

export const Stack = ({
  children,
  spacing: gap = "md",
  style,
}: StackProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          gap: spacing[gap],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});