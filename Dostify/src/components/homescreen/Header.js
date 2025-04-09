import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHT } from '../../constants/constant';


const Header = React.memo(({ notifications }) => {
  const navigation = useNavigation();

  const headerHeight = Platform.OS === 'android' ? 50 + StatusBar.currentHeight : 88;

  const openDrawer = () => {
    if (navigation && typeof navigation.openDrawer === 'function') {
      navigation.openDrawer();
    } else {
      console.warn('Navigation object or openDrawer method is not available. Ensure the Header is rendered within a Drawer Navigator screen.');
    }
  };

  return (
    <View style={[styles.header, { height: headerHeight }]}>
      <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={openDrawer}
            activeOpacity={0.6}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touch area
          >
            <MaterialCommunityIcons name="menu" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.username}>Raiyan Hasan</Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.6}
            onPress={() => console.log('Bell icon pressed')} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
          >
            <MaterialCommunityIcons name="bell-outline" size={26} color={COLORS.primary} />
            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>{notifications > 9 ? '9+' : notifications}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
             style={styles.profileButton}
             activeOpacity={0.8}
             onPress={() => console.log('Profile image pressed')} 
          >
            <Image
              source={{ uri: 'https://avatars.githubusercontent.com/u/143262732?s=400&u=217d826d2c7720ea0984e7d9adef340a521cca84&v=4' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    width: '100%',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.LARGE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.mediumGrey,
    zIndex: 100,
    elevation: 3, 
    shadowColor: COLORS.darkGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTop: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    padding: SPACING.SMALL,
    marginRight: SPACING.SMALL,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40, 
    height: 40, 
  },
  username: {
    fontSize: 20,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.darkGrey,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: SPACING.SMALL,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40, 
    height: 40, 
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    minWidth: 16, 
    height: 16,
    paddingHorizontal: 3, 
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },
  notificationCount: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    lineHeight: 10, 
  },
  profileButton: {
    marginLeft: SPACING.MEDIUM,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.lightGrey,
  },
});


export default Header;