import React, {useState} from 'react';
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
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {loginJobSeeker} from '../services/api';
import FormInput from '../components/FormInput';
import {PrimaryButton, SecondaryButton} from '../components/UIComponents';
import {COLORS, FONT_SIZES, SPACING, RADIUS, SHADOW} from '../utils/theme';
import {RootStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

interface LoginForm {
  phone: string;
  password: string;
}

interface FormErrors {
  phone?: string | null;
  password?: string | null;
}

const validate = ({phone, password}: LoginForm): FormErrors => {
  const errors: FormErrors = {};
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
  return errors;
};

const LoginScreen: React.FC<Props> = ({navigation}) => {
  const [form, setForm] = useState<LoginForm>({phone: '', password: ''});
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const setField =
    (key: keyof LoginForm) =>
    (val: string) => {
      setForm(prev => ({...prev, [key]: val}));
      if (errors[key]) {
        setErrors(prev => ({...prev, [key]: null}));
      }
    };

  const handleLogin = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const res = await loginJobSeeker({
        phone: form.phone.trim(),
        password: form.password,
      });
      console.log('Login success:', res);
      Alert.alert('Success', 'Welcome back!', [
        {text: 'OK', onPress: () => navigation.navigate('Landing')},
      ]);
    } catch (err) {
      Alert.alert(
        'Login Failed',
        (err as Error).message || 'Invalid credentials. Please try again.',
      );
    } finally {
      setLoading(false);
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
            <TouchableOpacity
              style={styles.back}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}>
              <View style={styles.backCircle}>
                <Text style={styles.backArrow}>‹</Text>
              </View>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.logo}>
              BHC<Text style={{color: COLORS.accent}}>Jobs</Text>
            </Text>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your job search
            </Text>
          </View>

          <View style={styles.card}>
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
              placeholder="Enter your password"
              value={form.password}
              onChangeText={setField('password')}
              error={errors.password}
              secureTextEntry
              leftIcon="🔒"
            />

            <TouchableOpacity style={styles.forgotRow}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <PrimaryButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              style={{marginTop: SPACING.md}}
            />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Don't have an account?</Text>
            <View style={styles.dividerLine} />
          </View>

          <SecondaryButton
            title="Create Account"
            onPress={() => navigation.navigate('Register')}
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
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
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    margin: SPACING.lg,
    marginTop: -SPACING.lg,
    ...SHADOW.lg,
  },
  forgotRow: {alignItems: 'flex-end', marginTop: -SPACING.sm},
  forgotText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
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

export default LoginScreen;
