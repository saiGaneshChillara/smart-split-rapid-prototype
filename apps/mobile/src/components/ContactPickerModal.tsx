import { ActivityIndicator, FlatList, Modal, StyleSheet, TextInput, View } from "react-native";
import { colors, spacing } from "../theme";
import { Screen } from "./Screen";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import { useEffect, useState } from "react";
import { RegisteredContact } from "../types/registeredContact";
import { getDeviceContacts } from "../services/contacts.service";
import { mapContacts } from "../utils/contactMapper";
import { searchUsers } from "../api/users";
import { mergeContacts } from "../utils/mergeContacts";
import { ContactRow } from "./ContactRow";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (users: RegisteredContact[]) => void;
  excludeUserIds?: string[];
};

export const ContactPickerModal = ({
  visible,
  onClose,
  onConfirm,
  excludeUserIds,
}: Props) => {
  const [contacts, setContacts] = useState<RegisteredContact[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const filteredContacts = contacts.filter(contact => contact.displayName.toLowerCase().includes(query.toLowerCase()));

  const toggleSelection = (userId: string) => {
    setSelectedIds(current => current.includes(userId) ? current.filter(id => id !== userId) : [...current, userId]);
  };

  useEffect(() => {
    if (!visible) {
      return;
    }

    setSelectedIds([]);
    setQuery("");

    const loadContacts = async () => {
      try {
        setLoading(true);

        const rawContacts = await getDeviceContacts();

        const mappedContacts = mapContacts(rawContacts);

        const users = await searchUsers(
          mappedContacts.map(c => c.phoneNumber),
        );

        const mergedContacts = mergeContacts(
          mappedContacts,
          users,
        ).filter(contact => !excludeUserIds?.includes(contact.userId));

        setContacts(mergedContacts)
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadContacts();
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
    >
      <Screen>
        <View style={styles.header}>
          <AppText variant="heading">
            Add Members
          </AppText>
        </View>

        <View style={{ flex: 1 }}>
          {loading ? (
            <ActivityIndicator size={"large"} />
          ) : (
            <>
            <TextInput 
              placeholder="Search contacts..."
              value={query}
              onChangeText={setQuery}
              style={styles.search}
            />
            <FlatList 
              data={filteredContacts}
              keyExtractor={(item) => item.userId}
              renderItem={({ item }) => (
                <ContactRow
                 contact={item}
                 selected={selectedIds.includes(item.userId)}
                 onPress={() => toggleSelection(item.userId)} 
                />
              )}
            />
            </>
          )}
        </View>

        <AppButton 
          title={`Add (${selectedIds.length})`}
          disabled={selectedIds.length === 0}
          onPress={() => {
            const selectedUsers = contacts.filter(contact => selectedIds.includes(contact.userId));

            onConfirm(selectedUsers);
          }}
        />

        <AppButton 
          title="Cancel"
          variant="secondary"
          onPress={onClose}
        />
      </Screen>
    </Modal>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  search: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
});