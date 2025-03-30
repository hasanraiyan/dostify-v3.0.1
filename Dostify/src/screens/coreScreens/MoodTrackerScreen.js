import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MoodTrackerScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Mood Tracker</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MoodTrackerScreen;
