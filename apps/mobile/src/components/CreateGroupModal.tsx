import { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet } from "react-native";
import { colors, spacing } from "../theme";
import { Card } from "./Card";
import { Stack } from "./Stack";
import { AppText } from "./AppText";
import { AppTextInput } from "./AppTextInput";
import { AppButton } from "./AppButton";
import { getApiErrorMessage } from "../utils/apiError";
import { createGroup } from "../api/groups";

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreated: () => Promise<void> | void;
};

export const CreateGroupModal = ({
  visible,
  onClose,
  onCreated,
}: Props) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);

      await createGroup(name.trim());

      setName("");
      onClose();

      await onCreated();
    } catch (error) {
      Alert.alert(
        "Unable to create a group",
        getApiErrorMessage(error),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
      >
        <Pressable
          style={styles.sheet}
          onPress={() => {}}
        >
          <Card>
            <Stack spacing="lg">
              <Stack spacing="sm">
                <AppText variant="heading">
                  Create Group
                </AppText>

                <AppText 
                  variant="body"
                  color={colors.textSecondary}
                >
                  Enter name for the group
                </AppText>
              </Stack>

              <AppTextInput 
                label="Group Name"
                placeholder="Goa Trip"
                value={name}
                onChangeText={setName}
              />

              <Stack spacing="sm">
                <AppButton 
                  title="Create"
                  loading={loading}
                  disabled={name.trim().length === 0}
                  onPress={handleCreate}
                />

                <AppButton 
                  title="Close"
                  variant="secondary"
                  onPress={onClose}
                />
              </Stack>
            </Stack>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    padding: spacing.lg,
  },
});