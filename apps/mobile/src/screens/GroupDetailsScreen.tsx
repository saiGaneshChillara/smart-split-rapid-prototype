import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { addMembers, getGroup } from '../api/groups';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { Stack } from '../components/Stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';
import { GroupDetails } from '../types/group';
import { getApiErrorMessage } from '../utils/apiError';
import { AppButton } from '../components/AppButton';
import { ContactPickerModal } from '../components/ContactPickerModal';
import { RegisteredContact } from '../types/registeredContact';

type Props = NativeStackScreenProps<
  AppStackParamList,
  "GroupDetails"
>;

const GroupDetailsScreen = ({ route, navigation }: Props) => {
  const { groupId } = route.params;

  const [loading, setLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);

  const [pickerVisible, setPickerVisible] = useState(false);

  const loadGroup = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getGroup(groupId);

      setGroupDetails(data);
    } catch (error) {
      Alert.alert(
        "Unable to load group",
        getApiErrorMessage(error),
        [
          {
            text: "OK",
            onPress: () => navigation.replace("Home"),
          },
        ]
      )
    } finally {
      setLoading(false);
    }
  }, [groupId, navigation]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  const handleAddMembers = async (
    users: RegisteredContact[],
  ) => {
    try {
      await addMembers(
        groupId,
        users.map(user => user.phoneNumber),
      );

      Alert.alert(
        "Success",
        `${users.length} member${users.length === 1 ? "" : "s"} added.`,
      );

      setPickerVisible(false);
    } catch (error) {
      Alert.alert(
        "Unable to add members",
        getApiErrorMessage(error),
      );
    }
  };

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size={"large"} />
      </Screen>
    );
  }

  if (!groupDetails) {
    return (
      <Screen>
        <AppText>Unable to load group</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Stack spacing='lg'>
          <AppText variant='heading'>
            {groupDetails.group.name}
          </AppText>

          <Card>
            <Stack spacing="md">
              <AppText variant='heading'>
                Members: ({groupDetails.members.length})
              </AppText>

              {groupDetails.members.map(member => (
                <Stack
                  key={member.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <AppText>
                    {member.name}
                  </AppText>

                  <AppText color={colors.textSecondary}>
                    {member.role}
                  </AppText>
                </Stack>
              ))}
            <AppButton 
              title='Add Members'
              variant='secondary'
              onPress={() => setPickerVisible(true)}
            />
            <ContactPickerModal 
              visible={pickerVisible}
              onClose={() => setPickerVisible(false)}
              excludeUserIds={groupDetails.members.map(m => m.id)}
              onConfirm={handleAddMembers}
            />
            </Stack>
          </Card>

          <Card>
            <AppText variant='heading'>
              Expenses
            </AppText>

            <AppText>
              Coming soon
            </AppText>
          </Card>

          <Card>
            <AppText variant='heading'>
              Balances
            </AppText>

            <AppText>
              Coming soon
            </AppText>
          </Card>
        </Stack>
      </ScrollView>
    </Screen>
  );
};

export default GroupDetailsScreen;