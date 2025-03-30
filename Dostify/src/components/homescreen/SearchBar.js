import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { width } from '../../constants/dimensions';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHT } from '../../constants/constant';

const SearchBar = React.memo(({ searchQuery, setSearchQuery }) => (
  <View style={styles.searchContainer}>
    <MaterialCommunityIcons name="magnify" size={22} color={COLORS.grey} style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder="Search..."
      placeholderTextColor={COLORS.grey}
      value={searchQuery}
      onChangeText={setSearchQuery}
      returnKeyType="search"
    />
    {searchQuery.length > 0 && (
      <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearSearchButton} activeOpacity={0.6}>
        <MaterialCommunityIcons name="close-circle" size={18} color={COLORS.mediumGrey} />
      </TouchableOpacity>
    )}
  </View>
));

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 10,
    paddingHorizontal: SPACING.LARGE,
    marginBottom: SPACING.XLARGE,
    height: 44,
  },
  searchIcon: {
    marginRight: SPACING.SMALL,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.LARGE,
    color: COLORS.darkGrey,
    height: '100%',
  },
  clearSearchButton: {
    padding: SPACING.XSMALL,
    marginLeft: SPACING.SMALL,
  },
});

export default SearchBar;