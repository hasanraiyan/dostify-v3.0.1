import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHT } from '../../constants/constant';

const MoodTracker = React.memo(({ moodOptions, selectedMood, setSelectedMood }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>How are you?</Text>
    <View style={styles.moodContainer}>
      {moodOptions.map((mood, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.moodOption,
            {
              backgroundColor:
                selectedMood === index ? mood.color + '20' : COLORS.lightGrey, // Opacity added
            },
          ]}
          activeOpacity={0.7}
          onPress={() => setSelectedMood(index)}
        >
          <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          <Text
            style={[
              styles.moodLabel,
              selectedMood === index && { color: mood.color, fontWeight: FONT_WEIGHT.SEMIBOLD },
            ]}
          >
            {mood.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
));

const styles = StyleSheet.create({
  // NOTE: sectionContainer & sectionTitle are duplicated here.
  // Consider creating a reusable <Section> component or a shared style object later.
  sectionContainer: {
    marginBottom: SPACING.XLARGE,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.darkGrey,
    marginBottom: SPACING.MEDIUM, // Added margin back from original MoodTracker placement
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.SMALL,
  },
  moodOption: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: SPACING.XSMALL,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: 12,
  },
  moodEmoji: {
    fontSize: 26,
    marginBottom: SPACING.XSMALL,
  },
  moodLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },
});

export default MoodTracker;