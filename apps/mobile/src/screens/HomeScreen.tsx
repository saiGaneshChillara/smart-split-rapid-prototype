import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { getGroups } from '../api/groups';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { CreateGroupModal } from '../components/CreateGroupModal';
import { EmptyState } from '../components/EmptyState';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { GroupCard } from '../components/GroupCard';
import { Screen } from '../components/Screen';
import { Stack } from '../components/Stack';
import { useAuth } from '../context/AuthContext';
import { Group } from '../types/group';
import { getApiErrorMessage } from '../utils/apiError';

const HomeScreen = () => {
  const { logout } = useAuth();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getGroups();

      setGroups(data);
    } catch (error) {
      Alert.alert(
        "Unable to load groups",
        getApiErrorMessage(error),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  if (loading) {
    return (
      <Screen>
        <ActivityIndicator size={"large"} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppText variant='heading'>
        My Groups
      </AppText>
      {groups.length === 0 ? (
        <>
          <EmptyState
            icon='👥'
            title="No groups yet"
            description="Create your first group to start splitting expenses."
          />
          <AppButton
            title="Logout"
            onPress={logout}
          />
        </>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <Stack>
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
              />
            ))}
            <AppButton
              title="Logout"
              onPress={logout}
            />
          </Stack>
        </ScrollView>
      )}

      <CreateGroupModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreated={fetchGroups}
      />

      <FloatingActionButton
        onPress={() => setModalVisible(true)}
      />
    </Screen>
  );
};

export default HomeScreen;