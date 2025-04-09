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

const QuickFeatures = React.memo(({ features }) => (
  <View style={styles.quickFeatureContainer}>
    {features.map((feature, index) => (
      <TouchableOpacity
        key={index}
        style={styles.quickFeatureItem}
        activeOpacity={0.7}
        onPress={() => console.log(`Pressed ${feature.name}`)}
      >
        <View style={[styles.quickFeatureIconContainer, { backgroundColor: feature.bgColor }]}>
          <MaterialCommunityIcons name={feature.icon} size={26} color={feature.color} />
        </View>
        <Text style={styles.quickFeatureText} numberOfLines={1}>
          {feature.name}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
));

const styles = StyleSheet.create({
  quickFeatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.XLARGE,
  },
  quickFeatureItem: {
    alignItems: 'center',
    maxWidth: (width - SPACING.LARGE * 2) / 4 - SPACING.SMALL, // Calculation using width
  },
  quickFeatureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.SMALL,
  },
  quickFeatureText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.darkGrey,
    textAlign: 'center',
    marginTop: SPACING.XSMALL,
  },
});

export default QuickFeatures;