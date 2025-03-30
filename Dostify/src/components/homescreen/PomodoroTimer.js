import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHT } from '../../constants/constant';

const PomodoroTimer = React.memo(({ pomodoroActive, remainingTime, togglePomodoro, formatTime }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={togglePomodoro}
    style={[
      styles.pomodoroContainer,
      { backgroundColor: pomodoroActive ? COLORS.primaryLight : COLORS.lightGrey },
    ]}
  >
    <View style={styles.pomodoroInfo}>
      <MaterialCommunityIcons
        name={pomodoroActive ? "timer-sand-complete" : "timer-outline"}
        size={28}
        color={pomodoroActive ? COLORS.primary : COLORS.darkGrey}
        style={{ marginRight: SPACING.MEDIUM }}
      />
      <View>
        <Text style={[styles.pomodoroTitle, { color: pomodoroActive ? COLORS.primary : COLORS.darkGrey }]}>
          {pomodoroActive ? formatTime(remainingTime) : "Start Focus"}
        </Text>
        <Text style={styles.pomodoroSubtitle}>
          {pomodoroActive ? 'Session in progress' : '25 min Pomodoro'}
        </Text>
      </View>
    </View>
    {/* You could add a stop/pause button here if needed */}
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  pomodoroContainer: {
    borderRadius: 12,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.LARGE,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.XLARGE,
  },
  pomodoroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  pomodoroTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  pomodoroSubtitle: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    marginTop: 2,
  },
});

export default PomodoroTimer;