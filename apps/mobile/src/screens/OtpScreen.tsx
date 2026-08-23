import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { Card } from '../components/Card';
import { OtpInput } from '../components/OtpInput';
import { Screen } from '../components/Screen';
import { Stack } from '../components/Stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { colors } from '../theme';

type Props = NativeStackScreenProps<
  AuthStackParamList,
  "VerifyOtp"
>;

const OtpScreen = ({ route }: Props) => {
  const { phoneNumber } = route.params;

  const [otp, setOtp] = useState("");

  const isValidOtp = otp.length === 6;

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
              value={otp}
              onChange={setOtp}
            />
          </Stack>

          <AppButton
            title='Verify'
            disabled={!isValidOtp}
            onPress={() => { }}
          />
        </Stack>
      </Card>
    </Screen>
  );
};

export default OtpScreen;