import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { Alert, Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Stack } from "../components/Stack";
import { AppText } from "../components/AppText";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { getApiErrorMessage } from "../utils/apiError";
import { verifyOtp } from "../api/auth";
import { colors } from "../theme";
import { AppTextInput } from "../components/AppTextInput";
import { AppButton } from "../components/AppButton";

type Props = NativeStackScreenProps<
  AuthStackParamList,
  "CompleteProfile"
>;
const CompleteProfileScreen = ({ route }: Props) => {
  const { phoneNumber, otp } = route.params;

  const { login } = useAuth();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidName = name.trim().length >= 2;

  const handleContinue = async () => {
    try {
      setLoading(true);

      const response = await verifyOtp(
        phoneNumber,
        otp,
        name.trim(),
      );

      if (!response.accessToken || !response.user) {
        throw new Error("Registration failed");
      }

      await login(
        response.accessToken,
        response.user,
      );
    } catch (error) {
      Alert.alert(
        "Registration failed",
        getApiErrorMessage(error)
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Screen>
      <Card>
        <Stack spacing="lg">
          <Stack spacing="sm">
            <AppText variant="heading">
              Complete Profile
            </AppText>

            <AppText
              variant="body"
              color={colors.textSecondary}
            >
              One last step before you start using Smart Split.
            </AppText>
          </Stack>

          <AppTextInput 
            label="Full Name"
            placeholder="John Doe"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
          />

          <AppButton 
            title="Continue"
            loading={loading}
            disabled={!isValidName || loading}
            onPress={handleContinue}
          />
        </Stack>
      </Card>
    </Screen>
  );
};

export default CompleteProfileScreen;
