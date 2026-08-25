import { Pressable, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import { Ionicons } from "@expo/vector-icons";

type FloatingActionButtonProps = {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
};

export const FloatingActionButton = ({
  onPress,
  icon = "add",
}: FloatingActionButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed
      ]}
    >
      <Ionicons 
        name={icon}
        size={32}
        color={colors.white}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: "absolute",

    right: spacing.lg,
    bottom: spacing.xl,

    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: colors.primary,

    justifyContent: "center",
    alignItems: "center",

    elevation: 8,

    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});