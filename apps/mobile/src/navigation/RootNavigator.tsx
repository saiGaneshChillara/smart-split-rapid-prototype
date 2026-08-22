import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { AuthNavigator } from "./AuthNavigator";

export const RootNavigator = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
};