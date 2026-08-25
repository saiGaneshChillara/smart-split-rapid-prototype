import { StyleSheet, View } from "react-native";
import { colors, spacing } from "../theme";
import { Stack } from "./Stack";
import { AppText } from "./AppText";

type Props = {
  icon: string;
  title: string;
  description: string;
};

export const EmptyState = ({
  icon,
  title,
  description,
}: Props) => {
  return (
    <View style={styles.container}>
      <Stack spacing="md">
        <AppText style={styles.icon}>
          {icon}
        </AppText>

        <Stack spacing="xs">
          <AppText
            variant="heading"
            style={styles.center}
          >
            {title}
          </AppText>

          <AppText
            variant="body"
            color={colors.textSecondary}
            style={styles.center}
          >
            {description}
          </AppText>
        </Stack>
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: spacing.xl,
  },
  icon: {
    fontSize: 56,
    textAlign: "center",
  },
  center: {
    textAlign: "center",
  },
});