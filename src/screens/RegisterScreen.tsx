import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  TextInput,
  Animated,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {registerJobSeeker, verifyPhone} from '../services/api';
import FormInput from '../components/FormInput';
import {PrimaryButton, SecondaryButton} from '../components/UIComponents';
import {COLORS, FONT_SIZES, SPACING, RADIUS, SHADOW} from '../utils/theme';
import {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  password?: string | null;
  confirmPassword?: string | null;
}

const validateStep1 = ({
  name,
  email,
  phone,
  password,
  confirmPassword,
}: RegisterForm): FormErrors => {
  const errors: FormErrors = {};
  if (!name.trim()) {
    errors.name = 'Full name is required';
  }
  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }
  const phoneClean = phone.trim();
  if (!phoneClean) {
    errors.phone = 'Phone number is required';
  } else if (!/^[0-9+\-\s]{7,15}$/.test(phoneClean)) {
    errors.phone = 'Enter a valid phone number';
  }
  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  return errors;
};

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({value, onChange}) => {
  const inputs = useRef<(TextInput | null)[]>([]);
  const digits = (value + '      ').slice(0, 6).split('');

  const handleChange = (text: string, idx: number) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    const newVal = digits
      .map((d, i) => (i === idx ? cleaned.slice(-1) : d))
      .join('')
      .trim();
    onChange(newVal);
    if (cleaned && idx < 5) {
      inputs.current[idx + 1]?.focus();
    }
  };

  const handleKey = (e: any, idx: number) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      !digits[idx].trim() &&
      idx > 0
    ) {
      inputs.current[idx - 1]?.focus();
    }
  };

  return (
    <View style={otp.row}>
      {[0, 1, 2, 3, 4, 5].map(idx => (
        <TextInput
          key={idx}
          ref={r => {
            inputs.current[idx] = r;
          }}
          style={[otp.box, digits[idx].trim() && otp.boxFilled]}
          maxLength={1}
          keyboardType="number-pad"
          value={digits[idx].trim()}
          onChangeText={t => handleChange(t, idx)}
          onKeyPress={e => handleKey(e, idx)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const otp = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: SPACING.lg,
  },
  box: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    textAlign: 'center',
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    backgroundColor: COLORS.offWhite,
  },
  boxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
});

const RegisterScreen: React.FC<Props> = ({navigation}) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [otp2, setOtp2] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpFromApi, setOtpFromApi] = useState('');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const setField =
    (key: keyof RegisterForm) =>
    (val: string) => {
      setForm(prev => ({...prev, [key]: val}));
      if (errors[key]) {
        setErrors(prev => ({...prev, [key]: null}));
      }
    };

  const handleRegister = async () => {
    const errs = validateStep1(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await registerJobSeeker({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        password_confirmation: form.confirmPassword,
      });

      const receivedOtp = (res as any)?.otp || (res as any)?.data?.otp || '';
      setOtpFromApi(receivedOtp);

      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setStep(2));
    } catch (err) {
      Alert.alert(
        'Registration Failed',
        (err as Error).message || 'Could not register. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp2.length < 6) {
      Alert.alert(
        'Invalid OTP',
        'Please enter the 6-digit OTP sent to your phone.',
      );
      return;
    }

    setLoading(true);
    try {
      await verifyPhone({
        phone: form.phone.trim(),
        otp: otp2,
      });

      Alert.alert(
        '🎉 Account Created!',
        'Your account has been verified successfully.',
        [{text: 'Sign In', onPress: () => navigation.navigate('Login')}],
      );
    } catch (err) {
      Alert.alert(
        'Verification Failed',
        (err as Error).message || 'Invalid OTP. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp2('');
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.back} onPress={goBack} activeOpacity={0.8}>
              <View style={styles.backCircle}>
                <Text style={styles.backArrow}>‹</Text>
              </View>
              <Text style={styles.backText}>
                {step === 2 ? 'Edit Details' : 'Back'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.logo}>
              BHC<Text style={{color: COLORS.accent}}>Jobs</Text>
            </Text>
            <Text style={styles.title}>
              {step === 1 ? 'Create Account' : 'Verify Phone'}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? 'Start your journey to find the perfect job'
                : `Enter the 6-digit OTP sent to ${form.phone}`}
            </Text>

            <View style={styles.progressRow}>
              <View style={[styles.progressDot, styles.progressDotActive]} />
              <View
                style={[
                  styles.progressLine,
                  step === 2 && styles.progressLineDone,
                ]}
              />
              <View
                style={[
                  styles.progressDot,
                  step === 2 && styles.progressDotActive,
                ]}
              />
            </View>
          </View>

          {step === 1 && (
            <View style={styles.card}>
              <FormInput
                label="Full Name"
                placeholder="John Doe"
                value={form.name}
                onChangeText={setField('name')}
                error={errors.name}
                autoCapitalize="words"
                leftIcon="👤"
              />
              <FormInput
                label="Email Address"
                placeholder="you@example.com"
                value={form.email}
                onChangeText={setField('email')}
                error={errors.email}
                keyboardType="email-address"
                leftIcon="✉️"
              />
              <FormInput
                label="Phone Number"
                placeholder="+880 1X XXXX XXXX"
                value={form.phone}
                onChangeText={setField('phone')}
                error={errors.phone}
                keyboardType="phone-pad"
                leftIcon="📱"
                maxLength={15}
              />
              <FormInput
                label="Password"
                placeholder="At least 6 characters"
                value={form.password}
                onChangeText={setField('password')}
                error={errors.password}
                secureTextEntry
                leftIcon="🔒"
              />
              <FormInput
                label="Confirm Password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChangeText={setField('confirmPassword')}
                error={errors.confirmPassword}
                secureTextEntry
                leftIcon="🔒"
              />

              <Text style={styles.terms}>
                By registering you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>.
              </Text>

              <PrimaryButton
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                style={{marginTop: SPACING.md}}
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.card}>
              <Text style={styles.otpLabel}>Enter OTP</Text>
              <OtpInput value={otp2} onChange={setOtp2} />

              {!!otpFromApi && (
                <View style={styles.otpHint}>
                  <Text style={styles.otpHintText}>
                    🛠 Dev mode – OTP from API:{' '}
                    <Text style={{fontWeight: '700'}}>{otpFromApi}</Text>
                  </Text>
                </View>
              )}

              <TouchableOpacity style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't receive it? </Text>
                <Text style={styles.resendLink} onPress={handleRegister}>
                  Resend OTP
                </Text>
              </TouchableOpacity>

              <PrimaryButton
                title="Verify & Continue"
                onPress={handleVerify}
                loading={loading}
                style={{marginTop: SPACING.lg}}
              />
            </View>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Already have an account?</Text>
            <View style={styles.dividerLine} />
          </View>

          <SecondaryButton
            title="Sign In"
            onPress={() => navigation.navigate('Login')}
            style={{marginHorizontal: SPACING.lg}}
          />

          <View style={{height: SPACING.xxxl}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {flex: 1, backgroundColor: COLORS.primary},
  scroll: {backgroundColor: COLORS.white, paddingBottom: SPACING.xxxl},
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  backArrow: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: '600',
    lineHeight: 24,
  },
  backText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    fontWeight: '600',
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl + 8,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 22,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressDotActive: {backgroundColor: COLORS.accent},
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 6,
  },
  progressLineDone: {backgroundColor: COLORS.accent},
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    margin: SPACING.lg,
    marginTop: -SPACING.lg,
    ...SHADOW.lg,
  },
  terms: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: SPACING.sm,
  },
  termsLink: {color: COLORS.primary, fontWeight: '600'},
  otpLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 0,
  },
  otpHint: {
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accentLight,
  },
  otpHintText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  resendText: {fontSize: FONT_SIZES.sm, color: COLORS.textMuted},
  resendLink: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  dividerLine: {flex: 1, height: 1, backgroundColor: COLORS.border},
  dividerText: {fontSize: FONT_SIZES.sm, color: COLORS.textMuted},
});

export default RegisterScreen;
