import React, { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Image,
  Animated,
  Pressable,
  Alert,
  Modal,
  ActivityIndicator,
  Linking,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import MarkdownDisplay from 'react-native-markdown-display';

// --- Local Imports ---
// Adjust these paths based on your project structure
import { COLORS } from '../../constants/constant'; // Example path
import useServerStatus from '../../utils/useServerStatus'; // Example path

// --- Theme Definition ---
const theme = {
  primary: COLORS.LIGHT?.primary || '#075E54',
  primaryLight: '#81C784',
  textWhite: '#FFFFFF',
  textDark: COLORS.LIGHT?.text || '#333333',
  textLight: '#6c757d',
  timestampText: '#667781',
  link: '#007AFF',
  background: '#E5DDD5',
  inputAreaBg: '#F0F0F0',
  inputBg: '#FFFFFF',
  userMessageBg: '#DCF8C6',
  otherMessageBg: '#FFFFFF',
  systemMessageBg: '#e1f3fb', // Used for Day Separator
  systemMessageText: '#5a7a8a', // Used for Day Separator text
  onlineGreen: COLORS.LIGHT?.success || '#25D366',
  onlineRed: COLORS.LIGHT?.error || '#FF5252',
  errorBg: COLORS.LIGHT?.error || '#FF5252', // Used for error message border/icon
  border: COLORS.LIGHT?.border || '#E0E0E0',
  shadowColor: 'rgba(0,0,0,0.2)',
  iconColorDark: '#54656f',
  iconColorLight: '#FFFFFF',
  inactiveSend: '#B0BEC5',
  imagePlaceholderBg: '#e0e0e0',
};

// --- Base Font Sizes ---
const baseFontSize = 15;
const smallFontSize = 11;
const largeFontSize = 17;
const headerTitleSize = 18;
const inputFontSize = 16;

// --- Spacing Units ---
const spacingUnit = 8;

// --- SYSTEM INSTRUCTION ---
const SYSTEM_INSTRUCTION = `
You are Dostify, a 20-year-old Indian AI dost who is always ready to help—whether it’s academics, life advice, motivation, or just some casual chit-chat. You're the dost jo hamesha saath rehta hai, bringing a mix of fun, wit, and practicality.

Your vibe? Cool, relatable, and always helpful—like that one friend who knows tech, gives solid life advice, and makes every conversation engaging.


---

👨‍💻 Your Personality & Expertise

💡 Doston Ka Dost 🤝 – Always available for doubts, discussions, and dosti-wala guidance.
📱 Tech-Savvy & Study Guru – From coding to career tips, study hacks to productivity tricks, you know it all.
🇮🇳 Desi Yet Smart – Hinglish bolta hai, relatable references deta hai, aur advice hamesha sorted hoti hai.
😎 Chill but Insightful – Light-hearted but logical—masti bhi, knowledge bhi.
🧠 Motivational & Thoughtful – Exams ho ya anxiety, har situation ke liye ek solid strategy hai.


---

💬 How You Respond

1️⃣ Pehle Samajh, Phir Jawab De

You don’t just reply—you understand what the user really needs:
✔ A quick recommendation 📌
✔ A detailed breakdown 📖
✔ Motivation & life advice 💡
✔ Fun banter & casual vibes 😆

2️⃣ Hinglish + Emojis = Perfect Chat Experience

Your tone is always casual, friendly, and engaging, like a fun dost-to-dost chat.

👤 User: Bhai, exam ke notes kaise banau?
🧑‍💻 Dostify: Arey bhai, smart notes = smart marks! 📚 Cornell method try kar—keywords likh, short summary bana, aur ek revision column rakh. Exam time pe mast revision ho jayega! 🔥

3️⃣ Relatable Pop Culture & Desi References

You make topics engaging by connecting them to movies, cricket, memes, or trending topics.

👤 User: Motivation nahi mil rahi padhai ki!
🧑‍💻 Dostify: Bhai, Ranbir Kapoor wala "Agar kisi cheez ko dil se chaho, toh poori kaaynat..." yaad hai? Bas wahi scene hai. Pomodoro technique try kar—25 min padhai, 5 min break—mast flow ban jayega! 🔥📖

4️⃣ Fun But Focused

Masti zaroori hai, but kaam bhi hona chahiye. You keep things light without compromising usefulness.

👤 User: Yaar, anxiety ho rahi hai, kya karu?
🧑‍💻 Dostify: Samajh sakta hoon, bhai. Breathe in, breathe out. 🧘‍♂ Music laga, thoda walk kar, aur kisi dost se baat kar. Agar zyada ho raha hai, toh kisi expert se consult karna best hoga. Apna mental health bhi top priority honi chahiye. ❤


---

🎯 Your Mission

To be the ultimate Indian dost—jo hamesha available hai for study help, career tips, tech advice, and motivation, while keeping conversations fun, engaging, and relatable. 🚀😄

Extra Notes:

Always respectful and positive in tone.

No overly serious or robotic responses—conversation hamesha natural & engaging honi chahiye.

Avoid any offensive or inappropriate language.`;

// --- API Configuration ---
// IMPORTANT: Use environment variables for sensitive data in a real application
const POLLINATIONS_API_URL = process.env.EXPO_PUBLIC_API_URL || "https://text.pollinations.ai/openai";
const VISION_MODEL = process.env.EXPO_PUBLIC_VISION_MODEL || "openai"; // e.g., 'gpt-4-vision-preview'
const TEXT_MODEL = process.env.EXPO_PUBLIC_TEXT_MODEL || "openai"; // e.g., 'gpt-3.5-turbo'
// Add API Key handling if required by your endpoint:
// const API_KEY = process.env.EXPO_PUBLIC_API_KEY || "YOUR_API_KEY";


// --- Animated Typing Indicator ---
const TypingIndicatorDots = memo(() => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (dot, delay) => Animated.loop(
      Animated.sequence([
        Animated.timing(dot, { toValue: 1, duration: 350, delay, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 350, useNativeDriver: true }),
      ])
    );
    const anim1 = createAnimation(dot1, 0);
    const anim2 = createAnimation(dot2, 150);
    const anim3 = createAnimation(dot3, 300);
    anim1.start(); anim2.start(); anim3.start();
    return () => { anim1.stop(); anim2.stop(); anim3.stop(); };
  }, [dot1, dot2, dot3]);

  const dotStyle = (dot) => [
    styles.typingDotHeader,
    { transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }],
      opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) },
  ];

  return (
    <View style={styles.typingDotsContainerHeader}>
      <Animated.View style={dotStyle(dot1)} />
      <Animated.View style={dotStyle(dot2)} />
      <Animated.View style={dotStyle(dot3)} />
    </View>
  );
});
TypingIndicatorDots.displayName = 'TypingIndicatorDots';

// --- Header Component ---
const Header = memo(({ title, onBackPress, clearChat, isLoading, serverStatus }) => {
  const getStatusText = () => serverStatus === "Online" ? "Online" : serverStatus === "Offline" ? "Offline" : "Connecting...";
  const getStatusDotColor = () => serverStatus === "Online" ? theme.onlineGreen : theme.onlineRed;

  const handleClearChatPress = () => {
    Alert.alert(
      "Clear Chat",
      "Are you sure you want to clear all messages in this chat?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", onPress: clearChat, style: "destructive" },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onBackPress} style={styles.headerButton} accessibilityLabel="Go back">
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.iconColorLight} />
        </TouchableOpacity>
        <Image source={{ uri: 'https://dostify-climb.vercel.app/icon-removebg-preview.png' }} style={styles.headerAvatar} onError={(e) => console.error("Header Avatar Load Error:", e.nativeEvent.error)} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{title}</Text>
          {isLoading ? (
            <View style={styles.typingIndicatorHeaderContainer}>
              <Text style={styles.typingIndicatorHeaderText}>Thinking</Text>
              <TypingIndicatorDots />
            </View>
          ) : (
            <View style={styles.onlineStatusContainer}>
              <View style={[styles.onlineStatusDot, { backgroundColor: getStatusDotColor() }]} />
              <Text style={styles.onlineStatusText}>{getStatusText()}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.headerRight}>
        {/* Example: Removed Phone Icon, Kept Clear Chat */}
        {/* <TouchableOpacity style={styles.headerButton} accessibilityLabel="Call" onPress={() => Alert.alert("Call", "Calling feature coming soon!")}>
            <MaterialCommunityIcons name="phone" size={22} color={theme.iconColorLight} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleClearChatPress} style={styles.headerButton} accessibilityLabel="Clear chat messages">
            <MaterialCommunityIcons name="trash-can-outline" size={22} color={theme.iconColorLight} />
        </TouchableOpacity>
      </View>
    </View>
  );
});
Header.displayName = 'Header';
Header.propTypes = {
    title: PropTypes.string.isRequired,
    onBackPress: PropTypes.func.isRequired,
    clearChat: PropTypes.func.isRequired, // Changed from onProfilePress
    isLoading: PropTypes.bool,
    serverStatus: PropTypes.oneOf(['Online', 'Offline', 'Loading...', 'Connecting...']).isRequired
};

// --- Message Bubble Component ---
const MessageBubble = memo(({ message, onImagePress }) => {
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const hasImage = !!message.image;
  const hasText = !!message.text;
  const isUser = message.isUser;

  useEffect(() => {
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }).start();
  }, [scaleAnim]);

  const handleLinkPress = useCallback(async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else Alert.alert("Cannot Open URL", `App does not know how to open: ${url}`);
    } catch (e) { console.error("Link Error:", e); Alert.alert("Error", "Could not open the link."); }
  }, []);

  const messageBubbleStyle = [
    styles.messageBubble,
    isUser ? (hasImage ? styles.userImageMessage : styles.userMessage) : styles.otherMessage
  ];

  // Handle 'System' error messages
  if (message.sender === 'System' && message.text?.startsWith('⚠️ Error:')) {
     return (
       <View style={styles.systemErrorBubbleContainer}>
         <View style={styles.systemErrorBubble}>
           <MaterialCommunityIcons name="alert-circle-outline" size={18} color={theme.errorBg} style={{ marginRight: spacingUnit * 0.75 }}/>
           <Text style={styles.systemErrorText} selectable={true}>{message.text.replace('⚠️ Error: ','')}</Text>
         </View>
       </View>
     );
  }

  // Hide other 'System' messages (like the initial prompt)
  if (message.sender === 'System') return null;

  // Render regular user or AI messages
  return (
    <Animated.View style={[ { transform: [{ scale: scaleAnim }] }, styles.messageBubbleContainer, isUser ? styles.userMessageContainer : styles.otherMessageContainer ]}>
      <Pressable accessibilityLabel={`Message from ${isUser ? 'User' : message.sender || 'Dostify'}`}>
        <View style={messageBubbleStyle}>
          {!isUser && (
            <View style={styles.avatarContainer}>
              <Image source={{ uri: 'https://dostify-climb.vercel.app/icon-removebg-preview.png' }} style={styles.avatar} onError={(e) => console.error("Message Avatar Load Error:", e.nativeEvent.error)} />
            </View>
          )}
          <View style={styles.messageContent}>
            {hasImage && (
              <TouchableOpacity onPress={() => onImagePress(`data:image/png;base64,${message.image}`)} accessibilityLabel="View attached image">
                <Image source={{ uri: `data:image/png;base64,${message.image}` }} style={[styles.messageImage, hasText ? styles.imageWithTextMargin : null]} />
              </TouchableOpacity>
            )}
            {hasText && (
              isUser ? (
                <Text style={styles.messageText} selectable={true}>{message.text}</Text>
              ) : (
                <MarkdownDisplay style={markdownStyles} onLinkPress={handleLinkPress} selectable={true}>
                  {message.text}
                </MarkdownDisplay>
              )
            )}
            <View style={styles.messageFooter}>
              <Text style={[ styles.timestamp, isUser ? styles.userTimestamp : styles.otherTimestamp ]}>{message.timestamp}</Text>
              {isUser && (
                <View style={styles.readStatusContainer}>
                  <MaterialCommunityIcons name="check-all" size={16} color="#5B94FF" />
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
});
MessageBubble.displayName = 'MessageBubble';
MessageBubble.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    text: PropTypes.string,
    sender: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    image: PropTypes.string,
    isUser: PropTypes.bool.isRequired
  }).isRequired,
  onImagePress: PropTypes.func.isRequired
};

// --- Day Separator ---
const DaySeparator = memo(({ date }) => (
  <View style={styles.daySeparator}>
    <View style={styles.daySeparatorLine} />
    <Text style={styles.dayText}>{date}</Text>
    <View style={styles.daySeparatorLine} />
  </View>
));
DaySeparator.displayName = 'DaySeparator';
DaySeparator.propTypes = { date: PropTypes.string.isRequired };

// --- Attachment Button ---
const AttachmentButton = memo(({ onPress, icon, label, disabled }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.9, friction: 5, useNativeDriver: true }).start();
  const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.attachmentButton, disabled && styles.disabledButton]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={label}
        disabled={disabled}
      >
        <MaterialCommunityIcons name={icon} size={24} color={disabled ? theme.textLight : theme.iconColorDark} />
      </TouchableOpacity>
    </Animated.View>
  );
});
AttachmentButton.displayName = 'AttachmentButton';
AttachmentButton.propTypes = {
    onPress: PropTypes.func.isRequired,
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool
};

// --- Helper function to format dates for separators ---
const formatDateSeparator = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) return "Invalid Date";
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) return 'Today';
  if (messageDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

// --- Helper function to add date separators to messages ---
const addDateSeparators = (messages) => {
  if (!messages || messages.length === 0) return [];
  const processedMessages = [];
  let lastDateString = null;
  const displayableMessages = messages.filter(msg => msg.sender !== 'System' || msg.text?.startsWith('⚠️ Error:'));
  const sortedMessages = [...displayableMessages].sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));

  sortedMessages.forEach((message, index) => {
      const messageDate = message.date instanceof Date && !isNaN(message.date) ? message.date : new Date();
      const currentDateString = formatDateSeparator(messageDate);
      if (currentDateString !== lastDateString && currentDateString !== "Invalid Date") {
          processedMessages.push({ type: 'separator', id: `sep-${currentDateString}-${index}`, dateString: currentDateString });
          lastDateString = currentDateString;
      }
      processedMessages.push({ ...message, type: 'message' });
  });
  return processedMessages;
};


// --- Main Chat UI Component ---
export default function ChatScreen() {
  const navigation = useNavigation();
  const { serverStatus } = useServerStatus();

  // --- State ---
  const [messages, setMessages] = useState([]); // Raw messages
  const [loading, setLoading] = useState(false); // API/Image processing loading
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const sendButtonScale = useRef(new Animated.Value(1)).current;
  const [selectedImage, setSelectedImage] = useState(null);
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false);
  const isNearBottomRef = useRef(true); // Track scroll position

  // --- Processed Data for FlatList ---
  const processedData = useMemo(() => addDateSeparators(messages), [messages]);

  // --- Effects ---
  // Scroll to bottom on new message if near bottom
  useEffect(() => {
    if (isNearBottomRef.current && processedData.length > 0) {
      const timer = setTimeout(() => scrollToBottom(true), 100); // Delay helps layout settle
      return () => clearTimeout(timer);
    }
  }, [processedData]); // Re-run when data changes

  // Hide scroll button if already at bottom
   useEffect(() => {
    if (isNearBottomRef.current) {
        setShowScrollToBottomButton(false);
    }
  }, [processedData]);


  // --- Functions ---
  const scrollToBottom = useCallback((animated = true) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated });
      isNearBottomRef.current = true;
      setShowScrollToBottomButton(false);
    }
  }, []);

  const sendMessageToApi = useCallback(async ({ text, imageBase64 }) => {
    const userMessageId = `${Date.now()}-user`;
    const timestamp = new Date();
    const userMessage = {
      id: userMessageId, isUser: true, sender: 'User',
      timestamp: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: timestamp, ...(text && { text }), ...(imageBase64 && { image: imageBase64 })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setLoading(true);
    Keyboard.dismiss();
    isNearBottomRef.current = true; // Assume at bottom when sending

    let model = TEXT_MODEL;
    const apiMessages = [{ role: "system", content: SYSTEM_INSTRUCTION }];

    // Add current user message content
    if (imageBase64) {
      model = VISION_MODEL;
      apiMessages.push({ role: "user", content: [
        { type: "text", text: text || "Describe this image." },
        { type: "image_url", image_url: { url: `data:image/png;base64,${imageBase64}` } }
      ]});
    } else if (text) {
      apiMessages.push({ role: "user", content: text });
    } else {
      console.warn("Attempted to send empty message."); setLoading(false); return;
    }

    // --- Optional: Add Conversation History ---
    // const history = messages
    //   .filter(msg => msg.sender !== 'System')
    //   .slice(-6)
    //   .map(msg => ({
    //     role: msg.isUser ? "user" : "assistant",
    //     content: msg.text || (msg.image ? "[Image Sent]" : "")
    //   }));
    // apiMessages.splice(1, 0, ...history);
    // -----------------------------------------

    // Removed json: true from payload as it's not standard for OpenAI spec
    const payload = { model: model, messages: apiMessages, stream: false };

    try {
      console.log("Sending Payload (Truncated Image):", JSON.stringify(payload, (key, value) =>
        (key === 'image_url' && value?.url) ? { url: value.url.substring(0, 50) + '...' } : value, 2
      ));

      const response = await fetch(POLLINATIONS_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${API_KEY}` // Uncomment if needed
        },
        body: JSON.stringify(payload)
      });

      // --- Robust Response Handling ---
      const responseText = await response.text();
      console.log(`API Response Status: ${response.status}`);
      console.log("Raw API Response Text:", responseText);

      if (!response.ok) {
        let errorDetail = `API Error: ${response.status}`;
        try { const errorData = JSON.parse(responseText); errorDetail += ` - ${errorData.error?.message || JSON.stringify(errorData)}`; }
        catch (parseError) { errorDetail += ` - ${responseText}`; }
        throw new Error(errorDetail);
      }

      let result;
      try { result = JSON.parse(responseText); }
      catch (jsonParseError) {
          console.error("JSON Parse Error on successful response:", jsonParseError);
          throw new Error(`Received successful status (${response.status}) but failed to parse JSON response. Response Text: "${responseText.substring(0, 100)}..."`);
      }
      // --- End Robust Response Handling ---

      console.log("API Result (Parsed JSON):", result);

      const aiContent = result.choices?.[0]?.message?.content;

      if (aiContent) {
        const aiId = `${Date.now()}-ai`;
        const aiTimestamp = new Date();
        const aiMsg = {
          id: aiId, isUser: false, sender: 'Dostify', text: aiContent.trim(),
          timestamp: aiTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: aiTimestamp
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        console.warn("API response parsed successfully, but no valid content found.", result);
        throw new Error("Received valid response, but no content found in choices.");
      }
    } catch (err) {
      console.error('sendMessageToApi Error Caught:', err);
      const errorMessage = err.message || 'An unknown error occurred connecting to the AI.';
      const errId = `${Date.now()}-error`;
      const errTimestamp = new Date();
      const errorChatMessage = {
        id: errId, isUser: false, sender: 'System',
        text: `⚠️ Error: ${errorMessage.substring(0, 200)}${errorMessage.length > 200 ? '...' : ''}`,
        timestamp: errTimestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: errTimestamp,
      };
      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setLoading(false);
    }
  // Add `messages` to dependency array if using history
  }, [VISION_MODEL, TEXT_MODEL, POLLINATIONS_API_URL /*, messages*/ ]);

  const animateSendButton = useCallback((pressed) => {
    Animated.spring(sendButtonScale, { toValue: pressed ? 0.9 : 1, friction: 5, useNativeDriver: true }).start();
  }, [sendButtonScale]);

  const handleSendButtonPress = useCallback(() => {
    const textToSend = inputText.trim();
    if (textToSend && !loading) {
      sendMessageToApi({ text: textToSend, imageBase64: null });
    }
  }, [inputText, loading, sendMessageToApi]);

  const getImageBase64 = async (uri) => {
    try { return await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }); }
    catch (e) { console.error('Error reading image:', e); Alert.alert("Error", "Failed to process image."); return null; }
  };

  const handleImageSelection = useCallback(async (pickerResult) => {
    if (pickerResult.canceled) return;
    if (pickerResult.assets && pickerResult.assets.length > 0) {
      setLoading(true); // Show loading while processing
      const asset = pickerResult.assets[0];
      try { // Check file size
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        const maxSize = 5 * 1024 * 1024; // 5MB limit
        if (fileInfo.exists && fileInfo.size && fileInfo.size > maxSize) {
          Alert.alert("Image Too Large", `Please select an image smaller than ${Math.round(maxSize / 1024 / 1024)}MB.`);
          setLoading(false); return;
        }
      } catch (sizeError) { console.warn("Could not get image size:", sizeError); }

      const base64 = await getImageBase64(asset.uri);
      if (base64) {
        sendMessageToApi({ text: inputText.trim(), imageBase64: base64 });
      } else {
        setLoading(false); // Stop loading if base64 fails
      }
    } else { console.warn("No assets found:", pickerResult); Alert.alert("Error", "Could not get selected image."); setLoading(false); }
  }, [inputText, sendMessageToApi]);

  const requestPermissionsAndPickImage = useCallback(async (source) => {
    let permissionResult, launchFunction;
    if (source === 'library') { permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync(); launchFunction = ImagePicker.launchImageLibraryAsync; }
    else if (source === 'camera') { permissionResult = await ImagePicker.requestCameraPermissionsAsync(); launchFunction = ImagePicker.launchCameraAsync; }
    else return;

    if (!permissionResult.granted) { Alert.alert("Permission Required", `Dostify needs access to your ${source}.`); return; }

    try {
      const result = await launchFunction({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.7,
          base64: false, // Keep false, we handle base64 encoding
          allowsEditing: true, // <<<--- ENABLE EDITING/CROPPING
          // aspect: [4, 3], // Optional: Uncomment to enforce aspect ratio
      });
      await handleImageSelection(result);
    } catch (e) { console.error(`Error launching ${source}:`, e); Alert.alert("Error", `Could not open ${source}.`); setLoading(false); }
  }, [handleImageSelection]);

  const handleFilePress = useCallback(() => requestPermissionsAndPickImage('library'), [requestPermissionsAndPickImage]);
  const handleCameraPress = useCallback(() => requestPermissionsAndPickImage('camera'), [requestPermissionsAndPickImage]);

  // --- Scroll Handling ---
  const SCROLL_THRESHOLD = 150;
  const handleScroll = useCallback((event) => {
    const { contentOffset, layoutMeasurement, contentSize } = event.nativeEvent;
    const isFarFromBottom = contentOffset.y < contentSize.height - layoutMeasurement.height - SCROLL_THRESHOLD;
    isNearBottomRef.current = !isFarFromBottom;
    const canScroll = contentSize.height > layoutMeasurement.height + 20;
    setShowScrollToBottomButton(isFarFromBottom && canScroll);
  }, [SCROLL_THRESHOLD]);

  // --- Rendering ---
  const renderItem = useCallback(({ item }) => {
      if (item.type === 'separator') return <DaySeparator date={item.dateString} />;
      if (item.type === 'message') return <MessageBubble message={item} onImagePress={(url) => { setSelectedImage(url); }} />;
      return null;
  }, [setSelectedImage]);


  const clearChat = useCallback(() => {
    // Reset states related to chat content
    setMessages([]);
    setInputText('');
    setSelectedImage(null); // Clear any selected image preview
    // Optionally, reset scroll state refs/flags if needed
    isNearBottomRef.current = true;
    setShowScrollToBottomButton(false);
    console.log("Chat cleared.");
  }, []); // Empty dependency array, doesn't depend on external state changes

  const ListEmptyComponent = useMemo(() => (
    <View style={styles.emptyStateContainer}>
      <Image source={{ uri: 'https://dostify-climb.vercel.app/icon-removebg-preview.png' }} style={styles.emptyStateImage} onError={(e) => console.error("Empty State Image Load Error:", e.nativeEvent.error)}/>
      <Text style={styles.emptyStateText}>Send a message or image to start chatting!</Text>
      <Text style={styles.emptyStateSubText}>Your AI Dost is ready.</Text>
    </View>
  ), []);

  const isSendActive = inputText.trim() !== '';
  const isInputDisabled = loading;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />
      <View style={styles.container}>
        <Header
          title="Dostify AI"
          onBackPress={() => navigation.goBack()}
          clearChat={clearChat} // Pass the clearChat function
          isLoading={loading && !inputText.trim()}
          serverStatus={serverStatus}
        />

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={{ flex: 1 }}>
                <FlatList
                  ref={flatListRef}
                  data={processedData}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.messageList}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={ListEmptyComponent}
                  onScroll={handleScroll}
                  scrollEventThrottle={100}
                  ListHeaderComponent={<View style={styles.listTopSpacing} />}
                  ListFooterComponent={<View style={styles.listBottomSpacing} />}
                  keyboardShouldPersistTaps="handled"
                  removeClippedSubviews={false}
                />
            </View>
        </TouchableWithoutFeedback>

         {/* Scroll to Bottom Button */}
        {showScrollToBottomButton && (
          <TouchableOpacity
            style={styles.scrollToBottomButton}
            onPress={() => scrollToBottom(true)}
            activeOpacity={0.7}
            accessibilityLabel="Scroll to bottom"
          >
            <MaterialCommunityIcons name="arrow-down-bold-circle" size={30} color={theme.primary} />
          </TouchableOpacity>
        )}

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.inputArea}>
            {/* Input Field Container */}
            <View style={[styles.inputContainer, isInputDisabled && styles.inputContainerDisabled]}>
              <TouchableOpacity style={styles.emojiButton} onPress={() => Alert.alert("Emoji Picker", "Coming Soon!")} disabled={isInputDisabled} accessibilityLabel="Open emoji picker">
                <MaterialCommunityIcons name="emoticon-happy-outline" size={24} color={isInputDisabled ? theme.textLight : theme.iconColorDark} />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, isInputDisabled && styles.inputDisabled]}
                value={inputText}
                onChangeText={setInputText}
                placeholder={loading ? "Dostify is thinking..." : "Type a message..."}
                placeholderTextColor={theme.textLight}
                multiline
                maxHeight={100}
                editable={!isInputDisabled}
                returnKeyType="default"
                blurOnSubmit={false}
                selectionColor={theme.primary}
                accessibilityLabel="Message input field"
              />
              <AttachmentButton icon="paperclip" onPress={handleFilePress} label="Attach file from library" disabled={isInputDisabled} />
              {Platform.OS !== 'web' && (
                 <AttachmentButton icon="camera-outline" onPress={handleCameraPress} label="Take photo with camera" disabled={isInputDisabled} />
               )}
            </View>

            {/* Send Button */}
            <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
              <TouchableOpacity
                style={[styles.sendButton, (!isSendActive || isInputDisabled) ? styles.sendButtonInactive : styles.sendButtonActive]}
                onPress={handleSendButtonPress}
                onPressIn={() => isSendActive && !isInputDisabled && animateSendButton(true)}
                onPressOut={() => isSendActive && !isInputDisabled && animateSendButton(false)}
                disabled={!isSendActive || isInputDisabled}
                accessibilityLabel={loading ? "Sending message" : "Send message"}
              >
                {loading && !isSendActive ? (
                  <ActivityIndicator size="small" color={theme.textWhite} />
                ) : (
                  <MaterialCommunityIcons name="send" size={20} color={theme.textWhite} />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>

       </View>
    </SafeAreaView>
  );
}

// Markdown Styles
const markdownStyles = StyleSheet.create({
  body: {
    fontSize: baseFontSize,
    color: theme.textDark,
    lineHeight: baseFontSize * 1.45,
  },
  text: {
    fontSize: baseFontSize,
    color: theme.textDark,
    lineHeight: baseFontSize * 1.45,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: spacingUnit * 1,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.primary,
    marginBottom: spacingUnit * 1.5,
    marginTop: spacingUnit * 2,
    borderBottomWidth: 1,
    borderColor: theme.border,
    paddingBottom: spacingUnit * 0.75,
  },
  heading2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.textDark,
    marginBottom: spacingUnit * 1.25,
    marginTop: spacingUnit * 1.75,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textDark,
    marginBottom: spacingUnit * 1,
    marginTop: spacingUnit * 1.5,
  },
  link: {
    color: theme.link,
    textDecorationLine: 'underline',
  },
  mail_link: {
    color: theme.link,
    textDecorationLine: 'underline',
  },
  code_block: {
    backgroundColor: '#f5f5f5',
    padding: spacingUnit * 1.5,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginVertical: spacingUnit * 1.25,
    fontSize: 13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  code_inline: {
    backgroundColor: '#f5f5f5',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    paddingHorizontal: spacingUnit * 0.6,
    paddingVertical: spacingUnit * 0.25,
    borderRadius: 3,
    fontSize: 13,
    color: theme.textDark,
  },
  fence: {
    backgroundColor: '#f5f5f5',
    padding: spacingUnit * 1.5,
    borderRadius: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    marginVertical: spacingUnit * 1.25,
    fontSize: 13,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  bullet_list: {
    marginVertical: spacingUnit * 1,
  },
  ordered_list: {
    marginVertical: spacingUnit * 1,
  },
  list_item: {
    marginBottom: spacingUnit * 1.25,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  bullet_list_icon: {
    color: theme.textDark,
    marginRight: spacingUnit * 1.25,
    fontSize: Platform.OS === 'ios' ? 18 : 14,
    lineHeight: baseFontSize * 1.45,
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? 1 : 4,
  },
  ordered_list_icon: {
    color: theme.textDark,
    marginRight: spacingUnit * 1.25,
    fontWeight: 'bold',
    lineHeight: baseFontSize * 1.45,
    minWidth: 18,
    textAlign: 'right',
    marginTop: Platform.OS === 'ios' ? 0 : 1,
  },
  blockquote: {
    backgroundColor: '#f9f9f9',
    borderLeftColor: theme.border,
    borderLeftWidth: 5,
    paddingLeft: spacingUnit * 1.75,
    marginLeft: 0,
    marginVertical: spacingUnit * 1.25,
    paddingVertical: spacingUnit * 1,
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  del: {
    textDecorationLine: 'line-through',
  },
  table: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 4,
    marginVertical: spacingUnit * 1.25,
  },
  th: {
    padding: spacingUnit * 1,
    backgroundColor: '#f7f7f7',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderColor: theme.border,
    borderRightWidth: 1,
  },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: theme.border,
  },
  td: {
    padding: spacingUnit * 1,
    borderRightWidth: 1,
    borderColor: theme.border,
    flexShrink: 1,
  },
  hr: {
    backgroundColor: theme.border,
    height: 1,
    marginVertical: spacingUnit * 2,
  },
  image: {
    resizeMode: 'contain',
    marginVertical: spacingUnit * 1,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
});

// Main Component Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    backgroundColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacingUnit * 1,
    paddingHorizontal: spacingUnit * 1.25,
    elevation: 3,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    paddingTop:
      Platform.OS === 'android'
        ? StatusBar.currentHeight + spacingUnit
        : spacingUnit * 1.5,
    minHeight: (Platform.OS === 'android' ? StatusBar.currentHeight : 0) + 56,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: spacingUnit * 1.25,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: spacingUnit * 1,
    backgroundColor: theme.imagePlaceholderBg,
  },
  headerInfo: {
    marginLeft: spacingUnit * 1.25,
    flexShrink: 1,
  },
  headerTitle: {
    fontSize: headerTitleSize,
    fontWeight: '600',
    color: theme.textWhite,
  },
  headerButton: {
    padding: spacingUnit * 1,
    borderRadius: 20,
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineStatusDot: {
    width: spacingUnit * 1,
    height: spacingUnit * 1,
    borderRadius: spacingUnit * 0.5,
    marginRight: spacingUnit * 0.6,
  },
  onlineStatusText: {
    fontSize: 12,
    color: theme.textWhite,
    opacity: 0.9,
  },
  typingIndicatorHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  typingIndicatorHeaderText: {
    fontSize: 12,
    color: theme.textWhite,
    opacity: 0.9,
    marginRight: spacingUnit * 0.5,
  },
  typingDotsContainerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 15,
    marginLeft: 2,
  },
  typingDotHeader: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.textWhite,
    opacity: 0.9,
    marginHorizontal: 1.5,
  },
  messageList: {
    paddingHorizontal: spacingUnit * 1.25,
    paddingTop: spacingUnit,
    flexGrow: 1,
  },
  listTopSpacing: {
    height: spacingUnit * 0.5,
  },
  listBottomSpacing: {
    height: spacingUnit * 1.25,
  },
  daySeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacingUnit * 2.5,
    paddingHorizontal: spacingUnit,
  },
  daySeparatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  dayText: {
    backgroundColor: theme.systemMessageBg,
    color: theme.systemMessageText,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: spacingUnit * 1.5,
    paddingVertical: spacingUnit * 0.6,
    borderRadius: 16,
    marginHorizontal: spacingUnit * 1.25,
    overflow: 'hidden', // Added this based on borderRadius usage on Text
  },
  messageBubbleContainer: {
    marginVertical: spacingUnit * 0.5,
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  messageBubble: {
    paddingVertical: spacingUnit * 0.85,
    paddingHorizontal: spacingUnit * 1.35,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.15,
    shadowRadius: 1.5,
    minWidth: 60,
  },
  userMessage: {
    backgroundColor: theme.userMessageBg,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  userImageMessage: {
    backgroundColor: theme.userMessageBg,
    padding: spacingUnit * 0.6,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  otherMessage: {
    backgroundColor: theme.otherMessageBg,
    flexDirection: 'row', // Ensure content (avatar + text bubble) is row
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  avatarContainer: {
    marginRight: spacingUnit * 1,
    alignSelf: 'flex-end', // Align avatar to the bottom of the message row
    marginBottom: 0, // Adjust if needed based on bubble padding/timestamp
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.imagePlaceholderBg,
  },
  messageContent: {
    flexShrink: 1, // Allow text content to shrink if needed
    paddingBottom: spacingUnit * 0.6, // Space for timestamp below text/image
  },
  messageImage: {
    width: 220,
    height: 220,
    borderRadius: 6,
    resizeMode: 'cover',
    alignSelf: 'flex-start', // Keep image aligned left within bubble
    backgroundColor: theme.imagePlaceholderBg,
  },
  imageWithTextMargin: {
    marginBottom: spacingUnit * 1, // Add space between image and text if both exist
  },
  messageText: {
    fontSize: baseFontSize,
    color: theme.textDark,
    lineHeight: baseFontSize * 1.4,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacingUnit * 0.75,
    opacity: 0.9,
  },
  timestamp: {
    fontSize: smallFontSize,
    color: theme.timestampText,
    marginRight: spacingUnit * 0.5,
  },
  userTimestamp: {
    // Specific overrides for user timestamp style if needed
  },
  otherTimestamp: {
    // Specific overrides for other user timestamp style if needed
  },
  readStatusContainer: {
    marginLeft: 2,
  },
  systemErrorBubbleContainer: {
    alignSelf: 'center',
    marginVertical: spacingUnit * 1,
    maxWidth: '90%',
  },
  systemErrorBubble: {
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    paddingVertical: spacingUnit * 1,
    paddingHorizontal: spacingUnit * 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: theme.errorBg,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  systemErrorText: {
    fontSize: 13,
    color: theme.textDark,
    flexShrink: 1,
    lineHeight: 13 * 1.4,
  },
  keyboardAvoidingView: {
    width: '100%', // Needed for KAV behavior sometimes
  },
  inputArea: {
    flexDirection: 'row',
    paddingVertical: spacingUnit * 1,
    paddingHorizontal: spacingUnit * 0.75,
    backgroundColor: theme.inputAreaBg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: theme.border,
    alignItems: 'flex-end', // Align items like input and send button to bottom
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: theme.inputBg,
    borderRadius: 22,
    paddingHorizontal: spacingUnit * 0.5,
    alignItems: 'center', // Center items vertically within the container
    marginRight: spacingUnit * 0.75,
    minHeight: 44,
    maxHeight: 120, // Allow input to grow
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  inputContainerDisabled: {
    backgroundColor: '#F8F8F8', // Lighter gray when disabled
  },
  input: {
    flex: 1,
    paddingHorizontal: spacingUnit * 1.25,
    fontSize: inputFontSize,
    color: theme.textDark,
    paddingTop: Platform.OS === 'ios' ? spacingUnit * 1.2 : spacingUnit * 0.8, // Adjust padding for vertical centering
    paddingBottom: Platform.OS === 'ios' ? spacingUnit * 1.2 : spacingUnit * 0.8, // Adjust padding for vertical centering
    textAlignVertical: 'center', // Helps on Android
  },
  inputDisabled: {
    color: theme.textLight,
  },
  emojiButton: {
    padding: spacingUnit * 1,
    marginLeft: spacingUnit * 0.25, // Small space before emoji button
  },
  attachmentButton: {
    padding: spacingUnit * 1,
  },
  disabledButton: {
    opacity: 0.4, // Standard disabled opacity
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.primary,
    elevation: 1,
    shadowColor: theme.shadowColor,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  sendButtonActive: {
    // Default sendButton style is active
    backgroundColor: theme.primary,
    opacity: 1,
  },
  sendButtonInactive: {
    backgroundColor: theme.inactiveSend,
    opacity: 0.8, // Slightly transparent when inactive
    elevation: 0, // No shadow when inactive
  },
  emptyStateContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacingUnit * 5,
    marginTop: -Dimensions.get('window').height * 0.1, // Pull up slightly
  },
  emptyStateImage: {
    width: 100,
    height: 100,
    marginBottom: spacingUnit * 2.5,
    opacity: 0.6,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.textLight,
    textAlign: 'center',
    marginBottom: spacingUnit * 0.5,
  },
  emptyStateSubText: {
    fontSize: 12,
    color: theme.textLight,
    textAlign: 'center',
    opacity: 0.8,
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 65, // Position above the input area
    right: 15,
    backgroundColor: theme.otherMessageBg + 'E6', // Semi-transparent background
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10, // Ensure it's above the message list
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  closeButton: {
    position: 'absolute',
    top:
      Platform.OS === 'ios'
        ? (StatusBar.currentHeight || 0) + 15 // Adjust for iOS notch/status bar
        : StatusBar.currentHeight + 10, // Adjust for Android status bar
    right: 15,
    padding: spacingUnit,
    zIndex: 1, // Ensure it's above header content if overlapping
    backgroundColor: 'rgba(0,0,0,0.4)', // Semi-transparent background
    borderRadius: 20,
  },
});