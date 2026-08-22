import { PropsWithChildren } from "react";
import { StyleSheet, Text, TextProps, TextStyle } from "react-native";
import { colors, typography } from "../theme";

type Variant = "heading" | "title" | "body" | "caption";

type AppTextProps = PropsWithChildren<
  TextProps & {
    variant?: Variant;
    color?: string;
    style?: TextStyle | TextStyle[];
  }
>;

export const AppText = ({
  children,
  variant = "body",
  color = colors.text,
  style,
  ...props
}: AppTextProps) => {
  return (
    <Text
      {...props}
      style={[
        styles.base,
        typography[variant],
        { color },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: colors.text,
  }
});