import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";


// Helper function to get the active route name from navigation state
const getActiveRouteName = (state) => {
  if (!state || !state.routes || state.index === undefined) {
    return null;
  }
  let route = state.routes[state.index];
  // Traverse nested navigators if necessary
  while (route.state) {
    // Make sure route.state exists and has routes/index before diving deeper
    if (route.state.routes && route.state.index !== undefined) {
      route = route.state.routes[route.state.index];
    } else {
      // If nested state is incomplete, break the loop
      break;
    }
  }
  return route.name;
};

// --- Custom Drawer Item Component ---
// ADDED 'navigation' to props
const CustomDrawerItem = ({ iconName, iconType = "MaterialCommunityIcons", label, navigateTo, currentRouteName, navigation }) => {
  const isActive = currentRouteName === navigateTo;
  const IconComponent = iconType === "MaterialIcons" ? MaterialIcons : MaterialCommunityIcons;

  // Define colors and styles based on active state
  const iconColor = isActive ? colors.primary : colors.iconInactive;
  const textColor = isActive ? colors.textActive : colors.textPrimary;
  const fontWeight = isActive ? '600' : '400'; // Semi-bold for active

  return (
    <TouchableOpacity
      style={styles.menuItemTouchable} // Style the touchable area
      onPress={() => {
        // Check if the target screen is nested within HomeTabs
        if (navigateTo === "Home" || navigateTo === "Chat") {
          navigation.navigate("HomeTabs", { screen: navigateTo });
        } else {
          // Navigate directly to other drawer screens
          navigation.navigate(navigateTo);
        }
        // Close the drawer after navigation
        navigation.dispatch(DrawerActions.closeDrawer());
      }}
      android_ripple={{ color: colors.ripple }}
    >
      {/* Active Indicator Bar */}
      <View style={[styles.indicator, isActive ? styles.indicatorActive : null]} />

      {/* Icon */}
      <IconComponent
        name={iconName}
        size={22} // Icon size
        color={iconColor}
        style={styles.icon}
      />

      {/* Text */}
      <Text style={[styles.menuText, { color: textColor, fontWeight }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// --- Main Custom Drawer Component ---
const CustomDrawer = (props) => {
  // Get the navigation object from props (passed by Drawer.Navigator)
  const { navigation, state } = props;

  // Get the current active route name using the helper, checking state exists
  const currentRouteName = state ? getActiveRouteName(state) : null;

  // --- User Data (Replace with your actual data source) ---
  const userData = {
    name: "Raiyan Hasan",
    email: "raiyanhasan2006@gmail.com",
    avatar: "https://instagram.fpat3-3.fna.fbcdn.net/v/t51.2885-19/485021332_671214895582314_5411209848968539928_n.jpg?_nc_ht=instagram.fpat3-3.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QHMCe6CJ7kRpoKMdvtyLuQ-7F0xWBLKGH_xayLECznIy7luHu8ndk7yePvD6LxcdTFu6gFMsqMS9xiowRILH8ic&_nc_ohc=0wfP2kQ0tSoQ7kNvgGVJhE4&_nc_gid=EWf13rxeG_1e4970WVKLRQ&edm=ALGbJPMBAAAA&ccb=7-5&oh=00_AYETDDpUfapk-9SzOl1_58tM_rHBDkM2YmcT5-ejrIiJKA&oe=67EC273E&_nc_sid=7d3ac5" // Placeholder Avatar URL
    // avatar: null // Use this line to test the placeholder icon
  };
  // --- ---

  // --- Drawer Menu Items Configuration ---
  // Note: Ensure "Home" and "Chat" exist within your BottomTabs navigator ('HomeTabs')
  // Note: Ensure all other 'navigateTo' values have a corresponding Drawer.Screen in DrawerNavigator.js
  const drawerItems = [
    { iconName: "home-outline", label: "Home", navigateTo: "Home" }, // Navigates within HomeTabs
    { iconName: "robot-outline", label: "Dostify", navigateTo: "Chat" }, // Navigates within HomeTabs
    { iconName: "account-circle-outline", label: "Profile", navigateTo: "Profile" },
    { iconName: "book-open-page-variant-outline", label: "Resources", navigateTo: "Resources" },
    { iconName: "chart-line", label: "Mood Tracker", navigateTo: "MoodTracker" },
    { iconName: "phone-alert-outline", label: "Crisis Help", navigateTo: "CrisisHelp" },
    { iconName: "calendar-check-outline", label: "Planner", navigateTo: "Planner" },
    { iconName: "timer-sand", label: "Pomodoro", navigateTo: "Pomodoros" }, // Check name: Pomodoros or Pomodoro?
    { iconName: "message-reply-text-outline", label: "Feedback", navigateTo: "Feedback" },
    { iconName: "cog-outline", label: "Settings", navigateTo: "Settings" },
  ];


  return (
    // Use DrawerContentScrollView to handle scrolling and safe areas
    <DrawerContentScrollView {...props} style={styles.drawerScrollView}>
      <View style={styles.container}>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          {userData.avatar ? (
            // Display user avatar if available
            <Image
              source={{ uri: userData.avatar }}
              style={styles.avatar}
            />
          ) : (
            // Display placeholder icon if no avatar
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <MaterialCommunityIcons name="account" size={30} color={colors.avatarText} />
            </View>
          )}
          {/* Container for Name and Email */}
          <View style={styles.profileTextContainer}>
            <Text style={styles.profileName} numberOfLines={1}>{userData.name}</Text>
            <Text style={styles.profileEmail} numberOfLines={1}>{userData.email}</Text>
          </View>
        </View>

        {/* Main Divider below profile header */}
        <View style={styles.mainDivider} />

        {/* Menu Items Section */}
        <View style={styles.menuContainer}>
          {/* Map through drawerItems to create CustomDrawerItem components */}
          {drawerItems.map((item) => (
            <CustomDrawerItem
              key={item.label} // Use label as key (ensure labels are unique)
              iconName={item.iconName}
              label={item.label}
              navigateTo={item.navigateTo}
              currentRouteName={currentRouteName}
              navigation={navigation} // <-- PASS NAVIGATION PROP DOWN
            // iconType={item.iconType} // Pass iconType if needed
            />
          ))}
        </View>

        {/* Optional: Add other elements like logout button or app version here */}

      </View>
    </DrawerContentScrollView>
  );
};

// --- Color Palette --- (Keep as is)
const colors = {
  primary: '#005AC1',        // Primary color for active indicator and icons
  background: '#F8F9FA',     // Drawer background color (off-white)
  textActive: '#0B1F3A',     // Text color for active menu item
  textPrimary: '#3C4043',    // Default text color for inactive items
  textSecondary: '#6c757d',  // Secondary text color (e.g., email)
  iconInactive: '#6c757d',   // Icon color for inactive items
  divider: '#dee2e6',        // Color for divider lines
  avatarBackground: '#ADB5BD', // Background color for avatar placeholder
  avatarText: '#FFFFFF',      // Text/icon color within avatar placeholder
  ripple: 'rgba(0, 90, 193, 0.1)', // Color for touch feedback ripple
};

// --- Styles --- (Keep as is, seems fine)
const styles = StyleSheet.create({
  drawerScrollView: {
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingBottom: 20, // Add some padding at the very bottom
  },
  // Profile Header Styles
  profileHeader: {
    paddingHorizontal: 16, // Horizontal padding for header
    paddingVertical: 24,   // Vertical padding for header
    flexDirection: 'row',  // Arrange avatar and text horizontally
    alignItems: 'center',  // Center items vertically in the header
  },
  avatar: {
    width: 50,             // Avatar image width
    height: 50,            // Avatar image height
    borderRadius: 25,      // Make avatar circular
    backgroundColor: colors.divider, // Placeholder background while loading
    marginRight: 12,       // Space between avatar and text
  },
  avatarPlaceholder: {
    backgroundColor: colors.avatarBackground, // Specific background for placeholder
    justifyContent: 'center', // Center placeholder icon
    alignItems: 'center',
  },
  profileTextContainer: {
    flex: 1, // Allow text section to fill remaining width
  },
  profileName: {
    fontSize: 15,
    fontWeight: '600', // Semi-bold font for name
    color: colors.textPrimary,
    marginBottom: 2,     // Space below name
  },
  profileEmail: {
    fontSize: 13,
    color: colors.textSecondary, // Use secondary text color for email
  },
  // Divider Styles
  mainDivider: {
    height: 1, // Thickness of the divider line
    backgroundColor: colors.divider,
    marginHorizontal: 16, // Indent divider from screen edges
    marginVertical: 8,    // Space above and below divider
  },
  // Menu Item Styles
  menuContainer: {
    paddingVertical: 8, // Vertical padding around the list of menu items
  },
  menuItemTouchable: {
    flexDirection: "row", // Arrange indicator, icon, and text horizontally
    alignItems: "center", // Center items vertically
    paddingVertical: 15,    // Vertical padding inside each item
    paddingHorizontal: 12,  // Horizontal padding inside each item (reduced slightly)
  },
  indicator: {
    width: 4,              // Width of the active indicator bar
    height: 24,            // Height of the active indicator bar
    backgroundColor: 'transparent', // Hide indicator when inactive
    marginRight: 14,       // Space between indicator and icon
    borderRadius: 2,       // Slightly rounded corners for indicator
  },
  indicatorActive: {
    backgroundColor: colors.primary, // Show indicator with primary color when active
  },
  icon: {
    marginRight: 20, // Space between icon and text label
    width: 24,       // Fixed width for icon alignment
    textAlign: 'center', // Center icon within its space (optional)
  },
  menuText: {
    fontSize: 14,
    letterSpacing: 0.1, // Subtle letter spacing
    flex: 1, // Allow text label to take remaining space
  },
});

// Export the component for use in your app
export default CustomDrawer;