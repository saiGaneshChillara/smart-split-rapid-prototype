import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { requestOtp } from '../api/auth';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { AppTextInput } from '../components/AppTextInput';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { Stack } from '../components/Stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { colors } from '../theme';
import { getApiErrorMessage } from '../utils/apiError';
import { isValidIndianPhoneNumber, normalizePhoneNumber } from '../utils/phone';

type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  "Login"
>;

const CountryCode = () => (
  <View style={styles.countryCode}>
    <AppText>+91</AppText>
  </View>
);

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizedPhone = useMemo(
    () => normalizePhoneNumber(phoneNumber),
    [phoneNumber],
  );

  const isValid = isValidIndianPhoneNumber(normalizedPhone);

  const phoneError = phoneNumber.length > 0 && !isValid ? "Enter a valid 10-digit mobile number" : undefined;

  const handleContinue = async () => {
    try {
      setLoading(true);

      await requestOtp(normalizedPhone);

      navigation.navigate("VerifyOtp", {
        phoneNumber: normalizedPhone,
      });
    } catch (error) {
      Alert.alert("Unable to send OTP", getApiErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Card>
        <Stack spacing='lg'>
          <Stack spacing='sm'>
            <AppText variant='heading'>Smart Split</AppText>
            <AppText
              variant='body'
              color={colors.textSecondary}
            >
              Split your expenses smartly
            </AppText>
          </Stack>

          <AppTextInput
            label='Phone Number'
            placeholder='9876543210'
            keyboardType='phone-pad'
            leftElement={<CountryCode />}
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(normalizePhoneNumber(text));
            }}
            maxLength={10}
            error={phoneError}
          />

          <AppButton
            title='Continue'
            loading={loading}
            disabled={!isValid || loading}
            onPress={handleContinue}
          />
        </Stack>
      </Card>
    </Screen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  countryCode: {
    paddingLeft: 16,
    paddingRight: 8,

    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
});