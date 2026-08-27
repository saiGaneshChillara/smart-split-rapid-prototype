import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { Stack } from '../components/Stack';
import { AppStackParamList } from '../navigation/AppNavigator';
import { useEffect, useState } from 'react';
import { GroupDetails } from '../types/group';
import { ActivityIndicator, Alert } from 'react-native';
import { getApiErrorMessage } from '../utils/apiError';
import { getGroup } from '../api/groups';
import { colors } from '../theme';

type Props = NativeStackScreenProps<
  AppStackParamList,
  "GroupDetails"
>;

const GroupDetailsScreen = ({ route, navigation }: Props) => {
  const { groupId } = route.params;

  const [loading, setLoading] = useState(true);
  const [groupDetails, setGroupDetails] = useState<GroupDetails | null>(null);

  useEffect(() => {
    const loadGroup = async () => {
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
              onPress: () => {
                navigation.replace("Home");
              },
            },
          ],
        );
      } finally {
        setLoading(false);
      }
    };

    loadGroup();
  }, [groupId]);

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
    </Screen>
  );
};

export default GroupDetailsScreen;