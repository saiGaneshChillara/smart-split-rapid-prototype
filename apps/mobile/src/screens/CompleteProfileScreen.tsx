import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../navigation/AuthNavigator";
import { Text, View } from "react-native";
import { Screen } from "../components/Screen";
import { Card } from "../components/Card";
import { Stack } from "../components/Stack";
import { AppText } from "../components/AppText";

type Props = NativeStackScreenProps<
  AuthStackParamList,
  "CompleteProfile"
>;
const CompleteProfileScreen = ({ route }: Props) => {
  const { phoneNumber, otp } = route.params;
  return (
    <Screen>
      <Card>
        <Stack spacing="lg">
          <AppText variant="heading">
            Complete Profile
          </AppText>

          <AppText>Phone: {phoneNumber}</AppText>

          <AppText>OTP: {otp}</AppText>
        </Stack>
      </Card>
    </Screen>
  );
};

export default CompleteProfileScreen;
