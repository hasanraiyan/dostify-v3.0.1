import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";

const getActiveRouteName = (state) => {
  if (!state || !state.routes || state.index === undefined) {
    return null;
  }
  let route = state.routes[state.index];
  while (route.state) {
    if (route.state.routes && route.state.index !== undefined) {
      route = route.state.routes[route.state.index];
    } else {
      break;
    }
  }
  return route.name;
};

const CustomDrawerItem = ({ iconName, iconType = "MaterialCommunityIcons", label, navigateTo, currentRouteName, navigation }) => {
  const isActive = currentRouteName === navigateTo;
  const IconComponent = iconType === "MaterialIcons" ? MaterialIcons : MaterialCommunityIcons;

  const iconColor = isActive ? colors.primary : colors.iconInactive;
  const textColor = isActive ? colors.textActive : colors.textPrimary;
  const fontWeight = isActive ? '600' : '400';

  return (
    <TouchableOpacity
      style={styles.menuItemTouchable}
      onPress={() => {
        if (navigateTo === "Home" || navigateTo === "Chat") {
          navigation.navigate("HomeTabs", { screen: navigateTo });
        } else {
          navigation.navigate(navigateTo);
        }
        navigation.dispatch(DrawerActions.closeDrawer());
      }}
      android_ripple={{ color: colors.ripple }}
    >
      <View style={[styles.indicator, isActive ? styles.indicatorActive : null]} />
      <IconComponent
        name={iconName}
        size={22}
        color={iconColor}
        style={styles.icon}
      />
      <Text style={[styles.menuText, { color: textColor, fontWeight }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const CustomDrawer = (props) => {
  const { navigation, state } = props;

  const currentRouteName = state ? getActiveRouteName(state) : null;

  const userData = {
    name: "Raiyan Hasan",
    email: "raiyanhasan2006@gmail.com",
    avatar: "https://avatars.githubusercontent.com/u/143262732?s=400&u=217d826d2c7720ea0984e7d9adef340a521cca84&v=4"
  };

  const drawerItems = [
    { iconName: "home-outline", label: "Home", navigateTo: "Home" },
    { iconName: "robot-outline", label: "Dostify", navigateTo: "Chat" },
    { iconName: "account-circle-outline", label: "Profile", navigateTo: "Profile" },
    { iconName: "book-open-page-variant-outline", label: "Resources", navigateTo: "Resources" },
    { iconName: "chart-line", label: "Mood Tracker", navigateTo: "MoodTracker" },
    { iconName: "phone-alert-outline", label: "Crisis Help", navigateTo: "CrisisHelp" },
    { iconName: "calendar-check-outline", label: "Planner", navigateTo: "Planner" },
    { iconName: "timer-sand", label: "Pomodoro", navigateTo: "Pomodoros" },
    { iconName: "message-reply-text-outline", label: "Feedback", navigateTo: "Feedback" },
    { iconName: "cog-outline", label: "Settings", navigateTo: "Settings" },
  ];


  return (
    <DrawerContentScrollView {...props} style={styles.drawerScrollView}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          {userData.avatar ? (
            <Image
              source={{ uri: userData.avatar }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialCommunityIcons name="account" size={30} color={colors.avatarText} />
            </View>
          )}
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName} numberOfLines={1}>{userData.name}</Text>
            <Text style={styles.profileEmail} numberOfLines={1}>{userData.email}</Text>
          </View>
        </View>

        <View style={styles.mainDivider} />

        <View style={styles.menuContainer}>
          {drawerItems.map((item) => (
            <CustomDrawerItem
              key={item.navigateTo}
              iconName={item.iconName}
              label={item.label}
              navigateTo={item.navigateTo}
              currentRouteName={currentRouteName}
              navigation={navigation}
            />
          ))}
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const colors = {
  primary: '#005AC1',
  background: '#F8F9FA',
  textActive: '#0B1F3A',
  textPrimary: '#3C4043',
  textSecondary: '#6c757d',
  iconInactive: '#6c757d',
  divider: '#dee2e6',
  avatarBackground: '#ADB5BD',
  avatarText: '#FFFFFF',
  ripple: 'rgba(0, 90, 193, 0.1)',
};

const styles = StyleSheet.create({
  drawerScrollView: {
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.divider,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: colors.avatarBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileTextContainer: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  mainDivider: {
    height: 1,
    backgroundColor: colors.divider,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  menuContainer: {
    paddingVertical: 8,
  },
  menuItemTouchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  indicator: {
    width: 4,
    height: 24,
    backgroundColor: 'transparent',
    marginRight: 14,
    borderRadius: 2,
  },
  indicatorActive: {
    backgroundColor: colors.primary,
  },
  icon: {
    marginRight: 20,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 14,
    letterSpacing: 0.1,
    flex: 1,
  },
});

export default CustomDrawer;