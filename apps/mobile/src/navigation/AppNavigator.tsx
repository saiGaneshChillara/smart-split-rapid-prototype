import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import GroupDetailsScreen from "../screens/GroupDetailsScreen";

export type AppStackParamList = {
  Home: undefined;

  GroupDetails: {
    groupId: string;
  };
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Home"
        component={HomeScreen}
      />

      <Stack.Screen 
        name="GroupDetails"
        component={GroupDetailsScreen}
      />
    </Stack.Navigator>
  );
};