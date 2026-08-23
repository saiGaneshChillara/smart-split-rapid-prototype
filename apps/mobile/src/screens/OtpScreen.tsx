import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useRef, useState } from 'react';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { OtpInput, OtpInutHandle } from '../components/OtpInput';
import { Screen } from '../components/Screen';
import { Stack } from '../components/Stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { colors } from '../theme';
import { useAuth } from '../context/AuthContext';
import { verifyOtp } from '../api/auth';
import { Alert } from 'react-native';
import { getApiErrorMessage } from '../utils/apiError';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  "VerifyOtp"
>;

const OtpScreen = ({ route, navigation }: Props) => {
  const { phoneNumber } = route.params;

  const [otp, setOtp] = useState("");
  const otpInputRef = useRef<OtpInutHandle>(null);

  const isValidOtp = otp.length === 6;

  const { login, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(authLoading);

  const handleVerify = async () => {
    try {
      setLoading(true);

      const response = await verifyOtp(phoneNumber, otp);

      if (response.requiresRegistration) {
        navigation.replace("CompleteProfile", {
          phoneNumber,
          otp,
        });
        return;
      }

      await login(response.accessToken, response.user);
    } catch (error) {
      Alert.alert("Verification failed", getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("transitionEnd", () => {
      otpInputRef.current?.focus();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Screen>
      <Card>
        <Stack spacing='lg'>
          <Stack spacing='sm'>
            <AppText variant='heading'>
              Verify OTP
            </AppText>

            <AppText
              variant='body'
              color={colors.textSecondary}
            >
              We've sent a verification code to
            </AppText>

            <AppText>
              +91 {phoneNumber}
            </AppText>

            <OtpInput
              ref={otpInputRef}
              value={otp}
              onChange={setOtp}
            />
          </Stack>

          <AppButton
            title='Verify'
            disabled={!isValidOtp || loading}
            loading={loading}
            onPress={handleVerify}
          />
        </Stack>
      </Card>
    </Screen>
  );
};

export default OtpScreen;