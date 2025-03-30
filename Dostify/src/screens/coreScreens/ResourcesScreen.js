import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ResourcesScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Resources</Text>
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

export default ResourcesScreen;
