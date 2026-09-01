import { Pressable, StyleSheet, View } from "react-native";
import { RegisteredContact } from "../types/registeredContact";
import { colors, spacing } from "../theme";
import { AppText } from "./AppText";

type Props = {
  contact: RegisteredContact;
  selected: boolean;
  onPress: () => void;
};

export const ContactRow = ({
  contact,
  selected,
  onPress,
}: Props) => {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.avatar}>
          <AppText variant="heading">
            {contact.displayName.charAt(0).toUpperCase()}
          </AppText>
        </View>

        <View style={styles.info}>
          <AppText variant="body">
            {contact.displayName}
          </AppText>

          <AppText variant="caption">
            {contact.phoneNumber}
          </AppText>
        </View>

        <View
          style={[
            styles.checkBox,
            selected && styles.selected,
          ]}
        >
          {selected && (
            <AppText color={colors.white}>✓</AppText>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "22",
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  checkBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  selected: {
    backgroundColor: colors.primary,
  },
});