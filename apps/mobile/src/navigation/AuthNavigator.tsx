import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import OtpScreen from "../screens/OtpScreen";

export type AuthStackParamList = {
  Login: undefined;
  VerifyOtp: {
    phoneNumber: string;
  };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen 
        name="VerifyOtp"
        component={OtpScreen}
      />
    </Stack.Navigator>
  );
};