import { Pressable, StyleSheet, View } from "react-native";
import { Group } from "../types/group";
import { colors, spacing } from "../theme";
import { Card } from "./Card";
import { AppText } from "./AppText";
import { formatRelativeDate } from "../utils/formatRelativeDate";

type Props = {
  group: Group;
  onPress?: () => void;
};

export const GroupCard = ({
  group,
  onPress,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        pressed && styles.pressed
      ]}
    >
      <Card>
        <View style={styles.header}>
          <AppText variant="heading">
            {group.name}
          </AppText>

          <View
            style={[
              styles.badge,
              group.role === "ADMIN" 
                ? styles.adminBadge
                : styles.memberBadge
            ]}
          >
            <AppText
              variant="caption"
              color={
                group.role === "ADMIN"
                  ? colors.white
                  : colors.primary
              }
            >
              {group.role}
            </AppText>
          </View>
        </View>
        <AppText
          variant="body"
          color={colors.textSecondary}
        >
          {formatRelativeDate(group.created_at)}
        </AppText>
      </Card>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  adminBadge: {
    backgroundColor: colors.primary,
  },
  memberBadge: {
    backgroundColor: colors.primaryLight,
  },
  pressed: {
    opacity: 0.85,
  },
});