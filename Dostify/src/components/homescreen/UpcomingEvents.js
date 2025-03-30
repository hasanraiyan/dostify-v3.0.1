import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { width } from '../../constants/dimensions';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHT } from '../../constants/constant';

const UpcomingEvents = React.memo(({ events }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>Upcoming</Text>
      {events.length > 0 && (
        <TouchableOpacity onPress={() => console.log("Pressed See All Tasks")} activeOpacity={0.7}>
          <Text style={styles.seeAllButton}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
    <View style={styles.upcomingEventsContainer}>
      {events.length > 0 ? (
        events.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.eventItem}
            activeOpacity={0.7}
            onPress={() => console.log(`Pressed Task: ${event.title}`)} // Keep onPress or pass handler
          >
            <View style={[styles.eventPriorityIndicator, { backgroundColor: event.color }]} />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {event.title}
              </Text>
              <Text style={styles.eventTime}>{event.dueTime}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={COLORS.mediumGrey} />
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noEventsContainer}>
          <MaterialCommunityIcons name="calendar-check-outline" size={32} color={COLORS.grey} style={{ marginBottom: SPACING.SMALL }} />
          <Text style={styles.noEventsText}>No upcoming tasks.</Text>
        </View>
      )}
    </View>
  </View>
));

const styles = StyleSheet.create({
  // NOTE: sectionContainer & sectionTitle are duplicated here.
  sectionContainer: {
    marginBottom: SPACING.XLARGE, // Was implicitly 0 before, adding back section margin
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.darkGrey,
  },
  seeAllButton: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  upcomingEventsContainer: {
    // Container for the list or the 'no events' view
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MEDIUM,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mediumGrey,
  },
  eventPriorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.MEDIUM,
  },
  eventContent: {
    flex: 1,
    marginRight: SPACING.SMALL,
  },
  eventTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.darkGrey,
    marginBottom: 2,
  },
  eventTime: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.XLARGE,
    marginTop: SPACING.SMALL,
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
  },
  noEventsText: {
    textAlign: 'center',
    color: COLORS.grey,
    fontSize: FONT_SIZES.MEDIUM,
    marginTop: SPACING.SMALL, // Adjusted from marginBottom on icon
  },
});

export default UpcomingEvents;