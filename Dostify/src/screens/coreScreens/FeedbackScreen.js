import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FeedbackScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Feedback</Text>
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

export default FeedbackScreen;
