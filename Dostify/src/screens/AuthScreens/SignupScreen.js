import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  StyleSheet, // Import StyleSheet here
  Dimensions, // Import Dimensions here
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FONT_SIZES, SPACING, APP_INFO } from '../../constants/constant';

import { config } from '../../constants/constant';
import { COLORS } from '../../constants/loginConstant';
const theme = COLORS.LIGHT;
const screenHeight = Dimensions.get('window').height; // Define screenHeight here

const styles = StyleSheet.create({ // Define styles here
  keyboardAvoidingContainer: { flex: 1, backgroundColor: theme.background },
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: SPACING.LARGE, paddingBottom: SPACING.EXTRA_LARGE },
  headerContainer: { alignItems: 'center' },
  logo: { width: 100, height: 100, marginBottom: SPACING.MEDIUM },
  headerText: { fontSize: FONT_SIZES.EXTRA_LARGE, fontWeight: 'bold', marginBottom: SPACING.SMALL, textAlign: 'center' },
  subHeaderText: { fontSize: FONT_SIZES.MEDIUM, textAlign: 'center' },
  formContainer: { /* Spacing handled internally */ },
  inputWrapper: { marginBottom: SPACING.MEDIUM },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: SPACING.SMALL, paddingHorizontal: SPACING.MEDIUM, height: 50, backgroundColor: theme.inputBackground || theme.background },
  inputIcon: { marginRight: SPACING.MEDIUM },
  input: { flex: 1, fontSize: FONT_SIZES.MEDIUM },
  errorText: { fontSize: FONT_SIZES.SMALL, marginTop: SPACING.SMALL / 2, marginLeft: SPACING.SMALL },
  formError: { textAlign: 'center', marginBottom: SPACING.MEDIUM, fontWeight: 'bold' },
  buttonContainer: { /* Container for the button */ },
  loginButton: { width: '100%', paddingVertical: SPACING.MEDIUM, borderRadius: SPACING.SMALL, alignItems: 'center', justifyContent: 'center', height: 50, marginTop: SPACING.SMALL },
  disabledButton: { opacity: 0.7 },
  loginText: { fontSize: FONT_SIZES.LARGE, fontWeight: 'bold' },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: SPACING.LARGE, paddingBottom: SPACING.SMALL },
  signupText: { fontSize: FONT_SIZES.MEDIUM },
  signupLink: { fontSize: FONT_SIZES.MEDIUM, fontWeight: 'bold', marginLeft: SPACING.SMALL / 2 },
});


const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Animation values
  const fadeAnimLogo = useRef(new Animated.Value(0)).current;
  const fadeAnimHeader = useRef(new Animated.Value(0)).current;
  const fadeAnimSubHeader = useRef(new Animated.Value(0)).current;
  const fadeAnimUser = useRef(new Animated.Value(0)).current;
  const fadeAnimEmail = useRef(new Animated.Value(0)).current;
  const fadeAnimPass = useRef(new Animated.Value(0)).current;
  const fadeAnimConfirmPass = useRef(new Animated.Value(0)).current;
  const fadeAnimButton = useRef(new Animated.Value(0)).current;
  const fadeAnimSignin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [
      Animated.timing(fadeAnimLogo, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimHeader, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimSubHeader, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimUser, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimEmail, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimPass, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimConfirmPass, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimButton, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(fadeAnimSignin, { toValue: 1, duration: 500, useNativeDriver: true }),
    ];

    Animated.stagger(100, animations).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Username is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number and special symbol';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = useCallback(async () => {
    if (validateForm() && !isLoading) {
      setIsLoading(true);
      setErrors({});
      try {
        const response = await fetch(config.BACKEND_SERVER_URL + '/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });

        const data = await response.json();

        if (response.status === 201) {
          // Registration successful
          console.log('Registration successful');
          navigation.navigate('LoginScreen'); // Navigate to Login screen after successful signup
        } else if (response.status === 400) {
          // Bad Request - try to handle specific errors from backend if available
          if (data && data.errors) {
            setErrors(data.errors); // Assuming backend sends errors in a 'errors' object
          } else {
            setErrors(data); // Fallback to setting the whole data object as errors
          }
        } else if (response.status === 409) {
          // Conflict -  try to handle specific errors from backend if available
          if (data && data.errors) {
            setErrors(data.errors); // Assuming backend sends errors in a 'errors' object
          } else {
            setErrors(data); // Fallback to setting the whole data object as errors
          }
        }
         else {
          // Internal Server Error or other errors
          setErrors({ form: 'An unexpected error occurred. Please try again.' });
        }
      } catch (error) {
        console.error('Signup error:', error);
        setErrors({ form: 'An unexpected error occurred. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  }, [username, email, password, confirmPassword, navigation, isLoading]);

  const togglePasswordVisibility = useCallback(() => setPasswordVisible(prev => !prev), []);
  const toggleConfirmPasswordVisibility = useCallback(() => setConfirmPasswordVisible(prev => !prev), []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardAvoidingContainer}
    >
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <Animated.View style={[styles.headerContainer, { opacity: fadeAnimLogo }]}>
          <Image source={require('../../../assets/android/mipmap-xxxhdpi/ic_launcher.png')} resizeMode="contain" style={styles.logo} />
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnimHeader, alignItems: 'center' }}>
          <Text style={[styles.headerText, { color: theme.text }]}>Create Account</Text>
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnimSubHeader, alignItems: 'center', marginBottom: SPACING.LARGE }}>
          <Text style={[styles.subHeaderText, { color: theme.textSecondary }]}>Join {APP_INFO.NAME} today!</Text>
        </Animated.View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          {/* Username Input */}
          <Animated.View style={[styles.inputWrapper, { opacity: fadeAnimUser }]}>
            <View style={[styles.inputContainer, { borderColor: errors.username ? theme.error : theme.border }]}>
              <Ionicons name="person-circle-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Username"
                placeholderTextColor={theme.textSecondary}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
            {errors.username && <Text style={[styles.errorText, { color: theme.error }]}>{errors.username}</Text>}
          </Animated.View>

          {/* Email Input */}
          <Animated.View style={[styles.inputWrapper, { opacity: fadeAnimEmail }]}>
            <View style={[styles.inputContainer, { borderColor: errors.email ? theme.error : theme.border }]}>
              <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email"
                placeholderTextColor={theme.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
              />
            </View>
            {errors.email && <Text style={[styles.errorText, { color: theme.error }]}>{errors.email}</Text>}
          </Animated.View>

          {/* Password Input */}
          <Animated.View style={[styles.inputWrapper, { opacity: fadeAnimPass }]}>
            <View style={[styles.inputContainer, { borderColor: errors.password ? theme.error : theme.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                returnKeyType="next"
              />
              <TouchableOpacity onPress={togglePasswordVisibility} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel={passwordVisible ? 'Hide password' : 'Show password'}>
                <Ionicons name={passwordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={[styles.errorText, { color: theme.error }]}>{errors.password}</Text>}
          </Animated.View>

          {/* Confirm Password Input */}
          <Animated.View style={[styles.inputWrapper, { opacity: fadeAnimConfirmPass }]}>
            <View style={[styles.inputContainer, { borderColor: errors.confirmPassword ? theme.error : theme.border }]}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Confirm Password"
                placeholderTextColor={theme.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!confirmPasswordVisible}
                returnKeyType="done"
                onSubmitEditing={handleSignup}
              />
              <TouchableOpacity onPress={toggleConfirmPasswordVisibility} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} accessibilityLabel={confirmPasswordVisible ? 'Hide confirm password' : 'Show confirm password'}>
                <Ionicons name={confirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text style={[styles.errorText, { color: theme.error }]}>{errors.confirmPassword}</Text>}
          </Animated.View>

          {/* Form-level Error Message */}
          {errors.form && (
            <Text style={[styles.errorText, styles.formError, { color: theme.error }]}>
              {errors.form}
            </Text>
          )}
        </View>

        {/* Button Section */}
        <Animated.View style={[styles.buttonContainer, { opacity: fadeAnimButton }]}>
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: isLoading ? theme.primaryMuted : theme.primary }, isLoading && styles.disabledButton]}
            onPress={handleSignup}
            disabled={isLoading}
            activeOpacity={0.8}
            accessibilityLabel="Sign Up"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={COLORS.DARK?.background || '#FFFFFF'} />
            ) : (
              <Text style={[styles.loginText, { color:  '#FFFFFF' }]}>Sign Up</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Sign In Navigation */}
        <Animated.View style={[styles.signupContainer, { opacity: fadeAnimSignin }]}>
            <Text style={[styles.signupText, { color: theme.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} accessibilityLabel="Sign In">
              <Text style={[styles.signupLink, { color: theme.primary }]}>Sign In</Text>
            </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};


export default SignupScreen;