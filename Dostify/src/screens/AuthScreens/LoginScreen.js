import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/loginConstant';
import { FONT_SIZES, SPACING, APP_INFO, STORAGE_KEYS } from '../../constants/constant'

import { useAuthContext } from '../../context/authContext';

const theme = COLORS.LIGHT;

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formErrors, setFormErrors] = useState({});


  const { login, loading, error } = useAuthContext();


  const fadeAnimLogo = useRef(new Animated.Value(0)).current;
  const fadeAnimHeader = useRef(new Animated.Value(0)).current;
  const fadeAnimSubHeader = useRef(new Animated.Value(0)).current;
  const fadeAnimUser = useRef(new Animated.Value(0)).current;
  const fadeAnimPass = useRef(new Animated.Value(0)).current;
  const fadeAnimForgot = useRef(new Animated.Value(0)).current;
  const fadeAnimButton = useRef(new Animated.Value(0)).current;
  const fadeAnimSignup = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      Animated.timing(fadeAnimLogo, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimHeader, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimSubHeader, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimUser, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimPass, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimForgot, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimButton, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimSignup, { toValue: 1, duration: 500, useNativeDriver: true }),
    ];

    Animated.stagger(100, animations).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Email or Username is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = useCallback(async () => {
    if (validateForm() && !loading) {
      try {
        await login(username, password);
      } catch (err) {

        setFormErrors({ form: err.message || 'Login failed' });
      }
    }
  }, [username, password, loading, login, navigation]);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible(prev => !prev);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <StatusBar
        barStyle={theme === COLORS.DARK ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        
        <Animated.View style={[styles.headerContainer, { opacity: fadeAnimLogo }]}>
          <Image
            source={require('../../../assets/android/mipmap-xxxhdpi/ic_launcher.png')}
            resizeMode="contain"
            style={styles.logo}
          />
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnimHeader, alignItems: 'center' }}>
          <Text style={[styles.headerText, { color: theme.text }]}>
            Welcome Back to Dostify
          </Text>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnimSubHeader, alignItems: 'center', marginBottom: 17 }}>
          <Text style={[styles.subHeaderText, { color: theme.textSecondary }]}>
            Sign in to continue
          </Text>
        </Animated.View>

        
        <View style={styles.formContainer}>
          
          <Animated.View style={[styles.inputWrapper, { opacity: fadeAnimUser }]}>
            <View style={[
              styles.inputContainer,
              { borderColor: formErrors.username ? theme.error : theme.border, backgroundColor: theme.inputBackground || theme.background }
            ]}>
              <Ionicons name="person-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email or Username"
                placeholderTextColor={theme.textSecondary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() =>{} }
              />
            </View>
            {formErrors.username && <Text style={[styles.errorText, { color: theme.error }]}>{formErrors.username}</Text>}
          </Animated.View>

          
          <Animated.View style={[styles.inputWrapper, { opacity: fadeAnimPass }]}>
            <View style={[
              styles.inputContainer,
              { borderColor: formErrors.password ? theme.error : theme.border, backgroundColor: theme.inputBackground || theme.background }
            ]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={togglePasswordVisibility} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            {formErrors.password && <Text style={[styles.errorText, { color: theme.error }]}>{formErrors.password}</Text>}
          </Animated.View>

          
          <Animated.View style={{ opacity: fadeAnimForgot }}>
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
            >
              <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </Animated.View>

          
          {(formErrors.form || error) && (
            <Text style={[styles.errorText, styles.formError, { color: theme.error }]}>
              {formErrors.form || error}
            </Text>
          )}
        </View>

        
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnimButton }]}>
          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: loading ? theme.primaryMuted : theme.primary },
              loading && styles.disabledButton
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.DARK?.background || '#FFFFFF'} />
            ) : (
              <Text style={[styles.loginText, { color: '#FFFFFF' }]}>Sign In</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        
        <Animated.View style={[styles.signupContainer, { opacity: fadeAnimSignup }]}>
          <Text style={[styles.signupText, { color: theme.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.signupLink, { color: theme.primary }]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 17,
    paddingBottom: SPACING.EXTRA_LARGE,
  },
  headerContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: SPACING.MEDIUM,
  },
  headerText: {
    fontSize: FONT_SIZES.EXTRA_LARGE,
    fontWeight: 'bold',
    marginBottom: SPACING.SMALL,
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: FONT_SIZES.MEDIUM,
    textAlign: 'center',
  },
  formContainer: {},
  inputWrapper: {
    marginBottom: SPACING.MEDIUM,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: SPACING.SMALL,
    paddingHorizontal: SPACING.MEDIUM,
    height: 50,
    backgroundColor: theme.inputBackground || theme.background,
  },
  inputIcon: {
    marginRight: SPACING.MEDIUM,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZES.MEDIUM,
  },
  errorText: {
    fontSize: FONT_SIZES.SMALL,
    marginTop: SPACING.SMALL / 2,
    marginLeft: SPACING.SMALL,
  },
  formError: {
    textAlign: 'center',
    marginBottom: SPACING.MEDIUM,
    fontWeight: 'bold',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.MEDIUM,
    paddingVertical: SPACING.SMALL / 2,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: '500',
  },
  buttonContainer: {},
  loginButton: {
    width: '100%',
    paddingVertical: SPACING.MEDIUM,
    borderRadius: SPACING.SMALL,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: SPACING.SMALL,
    backgroundColor: theme.primary,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loginText: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: 'bold',
    color: "#fff",
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 17,
    paddingBottom: SPACING.SMALL,
  },
  signupText: {
    fontSize: FONT_SIZES.MEDIUM,
  },
  signupLink: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: 'bold',
    marginLeft: SPACING.SMALL / 2,
  },
});

export default LoginScreen;