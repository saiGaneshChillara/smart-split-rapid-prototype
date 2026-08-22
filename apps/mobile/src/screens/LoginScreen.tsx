import React, { useState } from 'react';
import { AppButton } from '../components/AppButton';
import { AppText } from '../components/AppText';
import { AppTextInput } from '../components/AppTextInput';
import { Card } from '../components/Card';
import { Screen } from '../components/Screen';
import { Stack } from '../components/Stack';
import { colors } from '../theme';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <Screen>
      <Card>
        <Stack>
          <AppText variant='heading'>
            Welcome
          </AppText>

          <AppText
            variant="body"
            color={colors.textSecondary}
          >
            Split expenses effortlessly
          </AppText>

          <AppTextInput
            label='Phone Number'
            placeholder="+91 9876543210"
            keyboardType='phone-pad'
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <AppButton
            title='Continue'
            onPress={() => console.log(phoneNumber)}
          />
        </Stack>
      </Card>
    </Screen>
  );
};

export default LoginScreen;