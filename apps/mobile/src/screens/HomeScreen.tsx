import { View, Text } from 'react-native';
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AppButton } from '../components/AppButton';

const HomeScreen = () => {
  const { logout } = useAuth();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>HomeScreen</Text>

      <AppButton 
        title="Logout"
        onPress={logout}
      />
    </View>
  );
};

export default HomeScreen;