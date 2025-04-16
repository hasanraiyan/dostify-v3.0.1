

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  StyleSheet

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

  const [selectedMood, setSelectedMood] = useState(null);
  const [notifications, setNotifications] = useState(3);
  const [pomodoroActive, setPomodoroActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(25 * 60);
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    let interval;
    if (pomodoroActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(time => time - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setPomodoroActive(false);
      setRemainingTime(25 * 60);
      console.log("Pomodoro session finished!");

    }

    return () => clearInterval(interval);
  }, [pomodoroActive, remainingTime]);



  const formatTime = useCallback(timeInSeconds => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);


  const togglePomodoro = useCallback(() => {
    if (pomodoroActive) {

      setPomodoroActive(false);


    } else {
      setRemainingTime(25 * 60);
      setPomodoroActive(true);
    }
  }, [pomodoroActive]);



  const quickFeatures = useMemo(() => [
    { name: 'AI Chat', icon: 'message-reply-text-outline', color: COLORS.primary, bgColor: COLORS.primaryLight },
    { name: 'Resources', icon: 'book-open-variant', color: COLORS.accent, bgColor: COLORS.accentLight },
    { name: 'Mood', icon: 'emoticon-happy-outline', color: COLORS.warning, bgColor: COLORS.warningLight },
    { name: 'Plan', icon: 'calendar-check-outline', color: COLORS.secondary, bgColor: COLORS.secondaryLight },
  ], []);


  const mainFeatures = useMemo(() => [
    { title: 'Study Assistant', description: 'AI-powered study help', icon: 'brain', iconType: 'MaterialCommunityIcons', gradient: [COLORS.primary, '#5899FF'] },
    { title: 'Mood Journal', description: 'Track your daily feelings', icon: 'notebook-edit-outline', iconType: 'MaterialCommunityIcons', gradient: [COLORS.warning, '#FFB84D'] },
    { title: 'Career Guide', description: 'Explore paths & skills', icon: 'briefcase-search-outline', iconType: 'MaterialCommunityIcons', gradient: [COLORS.accent, '#C879FF'] },
    { title: 'Crisis Support', description: 'Get help immediately', icon: 'lifebuoy', iconType: 'MaterialCommunityIcons', gradient: [COLORS.danger, '#FF6B64'] },
  ], []);


  const upcomingEvents = useMemo(() => [
    { title: 'Psychology Essay', dueTime: 'Tomorrow, 11:59 PM', priority: 'High', color: COLORS.danger },
    { title: 'Team Project Sync', dueTime: 'Today, 3:30 PM', priority: 'Medium', color: COLORS.warning },
    { title: 'Review Math Concepts', dueTime: 'Thursday, 10:00 AM', priority: 'Low', color: COLORS.primary },


  ], []);


  const moodOptions = useMemo(() => [
    { emoji: '🥳', label: 'Great', color: COLORS.success },
    { emoji: '😊', label: 'Good', color: COLORS.primary },
    { emoji: '🙂', label: 'Okay', color: COLORS.warning },
    { emoji: '😕', label: 'Low', color: '#FF6D00' },
    { emoji: '😥', label: 'Bad', color: COLORS.danger },
  ], []);


  return (
    <SafeAreaView style={styles.safeArea}>
      
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      
      <Header notifications={notifications} />

      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        
        <View style={styles.contentContainer}>
          
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          
          <QuickFeatures features={quickFeatures} />

          
          <PomodoroTimer
            pomodoroActive={pomodoroActive}
            remainingTime={remainingTime}
            togglePomodoro={togglePomodoro}
            formatTime={formatTime}
          />

          
          <MoodTracker
            moodOptions={moodOptions}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
          />

          
          <MainFeatures features={mainFeatures} />

          
          <UpcomingEvents events={upcomingEvents} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;



const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },



  scrollContent: {
    paddingBottom: SPACING.XXLARGE,
  },



  contentContainer: {
    paddingHorizontal: SPACING.LARGE,
    paddingTop: SPACING.LARGE,
  },
});