// src/screens/HomeScreen/HomeScreen.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  StyleSheet
  // Removed imports for components now in separate files
} from 'react-native';
import { COLORS, SPACING } from '../../constants/constant';
import Header from '../../components/homescreen/Header';
import SearchBar from '../../components/homescreen/SearchBar';
import QuickFeatures from '../../components/homescreen/QuickFeatures';
import PomodoroTimer from '../../components/homescreen/PomodoroTimer';
import MoodTracker from '../../components/homescreen/MoodTracker';
import MainFeatures from '../../components/homescreen/MainFeatures';
import UpcomingEvents from '../../components/homescreen/UpcomingEvents';



const HomeScreen = () => {
  // --- State Management ---
  const [selectedMood, setSelectedMood] = useState(null);
  const [notifications, setNotifications] = useState(3); // Example notification count
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(25 * 60); // 25 minutes in seconds
  const [searchQuery, setSearchQuery] = useState('');

  // --- Effects ---
  // Pomodoro Timer Logic
  useEffect(() => {
    let interval;
    if (pomodoroActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(time => time - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setPomodoroActive(false);
      setRemainingTime(25 * 60); // Reset for next time
      console.log("Pomodoro session finished!");
      // TODO: Add user notification (alert, vibration, sound)
    }
    // Cleanup function to clear interval when component unmounts or dependencies change
    return () => clearInterval(interval);
  }, [pomodoroActive, remainingTime]);

  // --- Callbacks ---
  // Format time helper for Pomodoro
  const formatTime = useCallback(timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Toggle Pomodoro session
  const togglePomodoro = useCallback(() => {
    if (pomodoroActive) {
      // Optional: Add confirmation if stopping mid-session
      setPomodoroActive(false);
      // Decide whether to reset time when manually stopped
      // setRemainingTime(25 * 60);
    } else {
      setRemainingTime(25 * 60); // Ensure timer starts from 25:00
      setPomodoroActive(true);
    }
  }, [pomodoroActive]);

  // --- Data Definitions (Memoized for performance) ---
  // Data for QuickFeatures component
  const quickFeatures = useMemo(() => [
    { name: 'AI Chat', icon: 'message-reply-text-outline', color: COLORS.primary, bgColor: COLORS.primaryLight },
    { name: 'Resources', icon: 'book-open-variant', color: COLORS.accent, bgColor: COLORS.accentLight },
    { name: 'Mood', icon: 'emoticon-happy-outline', color: COLORS.warning, bgColor: COLORS.warningLight },
    { name: 'Plan', icon: 'calendar-check-outline', color: COLORS.secondary, bgColor: COLORS.secondaryLight },
  ], []); // Empty dependency array means this runs once

  // Data for MainFeatures component
  const mainFeatures = useMemo(() => [
    { title: 'Study Assistant', description: 'AI-powered study help', icon: 'brain', iconType: 'MaterialCommunityIcons', gradient: [COLORS.primary, '#5899FF'] },
    { title: 'Mood Journal', description: 'Track your daily feelings', icon: 'notebook-edit-outline', iconType: 'MaterialCommunityIcons', gradient: [COLORS.warning, '#FFB84D'] },
    { title: 'Career Guide', description: 'Explore paths & skills', icon: 'briefcase-search-outline', iconType: 'MaterialCommunityIcons', gradient: [COLORS.accent, '#C879FF'] },
    { title: 'Crisis Support', description: 'Get help immediately', icon: 'lifebuoy', iconType: 'MaterialCommunityIcons', gradient: [COLORS.danger, '#FF6B64'] },
  ], []);

  // Data for UpcomingEvents component
  const upcomingEvents = useMemo(() => [
     { title: 'Psychology Essay', dueTime: 'Tomorrow, 11:59 PM', priority: 'High', color: COLORS.danger },
     { title: 'Team Project Sync', dueTime: 'Today, 3:30 PM', priority: 'Medium', color: COLORS.warning },
     { title: 'Review Math Concepts', dueTime: 'Thursday, 10:00 AM', priority: 'Low', color: COLORS.primary },
     // Example: Clear array to test 'No events' state:
     // [],
  ], []);

   // Data for MoodTracker component
   const moodOptions = useMemo(() => [
    { emoji: '🥳', label: 'Great', color: COLORS.success },
    { emoji: '😊', label: 'Good', color: COLORS.primary },
    { emoji: '🙂', label: 'Okay', color: COLORS.warning },
    { emoji: '😕', label: 'Low', color: '#FF6D00' }, // Custom color example
    { emoji: '😥', label: 'Bad', color: COLORS.danger },
  ], []);

  // --- Render ---
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Configure Status Bar */}
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* Render the static Header */}
      <Header notifications={notifications} />

      {/* Scrollable content area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent} // Style for inner content (padding)
        showsVerticalScrollIndicator={false} // Hide scrollbar
        keyboardShouldPersistTaps="handled" // Handle taps inside ScrollView when keyboard is open
      >
        {/* Inner View for overall content padding */}
        <View style={styles.contentContainer}>
          {/* Render Search Bar and pass state + handler */}
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* Render Quick Features and pass data */}
          <QuickFeatures features={quickFeatures} />

          {/* Render Pomodoro Timer and pass state + handlers + data */}
          <PomodoroTimer
            pomodoroActive={pomodoroActive}
            remainingTime={remainingTime}
            togglePomodoro={togglePomodoro}
            formatTime={formatTime}
          />

          {/* Render Mood Tracker and pass state + handler + data */}
          <MoodTracker
            moodOptions={moodOptions}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />

          {/* Render Main Features and pass data */}
          <MainFeatures features={mainFeatures} />

          {/* Render Upcoming Events and pass data */}
          <UpcomingEvents events={upcomingEvents} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;


 
const styles = StyleSheet.create({
  // Style for the main SafeAreaView container
  safeArea: {
    flex: 1, // Ensure it takes up the full screen height
    backgroundColor: COLORS.white, // Match the header background for a seamless look
  },

  // Style for the ScrollView's internal content container
  // This is useful for adding padding at the bottom so content doesn't get cut off
  scrollContent: {
    paddingBottom: SPACING.XXLARGE, // Provides space below the last item
  },

  // Style for the View wrapping all the components inside the ScrollView
  // Used to apply consistent horizontal padding and top padding below the header
  contentContainer: {
    paddingHorizontal: SPACING.LARGE, // Left and right padding for all content
    paddingTop: SPACING.LARGE, // Padding below the static header
  },
});