import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { width } from '../../constants/dimensions';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHT } from '../../constants/constant';

const MainFeatures = React.memo(({ features }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Explore</Text>
    <View style={styles.mainFeaturesContainer}>
      {features.map((feature, index) => (
        <TouchableOpacity
          key={index}
          style={styles.featureCard}
          activeOpacity={0.8}
          onPress={() => console.log(`Pressed ${feature.title}`)} 
        >
          <LinearGradient
            colors={feature.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featureCardGradient}
          >
            <View style={styles.featureIconWrapper}>
              {feature.iconType === 'MaterialCommunityIcons' && (
                <MaterialCommunityIcons name={feature.icon} size={28} color={COLORS.white} />
              )}
              {feature.iconType === 'FontAwesome5' && (
                <FontAwesome5 name={feature.icon} size={26} color={COLORS.white} />
              )}
              {feature.iconType === 'Ionicons' && (
                <Ionicons name={feature.icon} size={28} color={COLORS.white} />
              )}
            </View>
          </LinearGradient>
          <View style={styles.featureCardContent}>
            <Text style={styles.featureCardTitle}>{feature.title}</Text>
            <Text style={styles.featureCardDescription} numberOfLines={2}>
              {feature.description}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </View>
));

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: SPACING.XLARGE,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.darkGrey,
    marginBottom: SPACING.MEDIUM,
  },
  mainFeaturesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - SPACING.LARGE * 2 - SPACING.MEDIUM) / 2, 
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: SPACING.MEDIUM,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
  },
  featureCardGradient: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.SMALL,
  },
  featureIconWrapper: {
    // No specific styles needed here in this version
  },
  featureCardContent: {
    padding: SPACING.MEDIUM,
    minHeight: 75,
  },
  featureCardTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.darkGrey,
    marginBottom: 3,
  },
  featureCardDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    lineHeight: 16,
  },
});

export default MainFeatures;