
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react"; // Ensure React is imported if not already
import { View } from 'react-native'; // Import View for placeholder screen
import HomeScreen from "../screens/coreScreens/HomeScreen";
import ChatScreen from "../screens/coreScreens/ChatScreen";
import ProfileScreen from "../screens/coreScreens/ProfileScreen";
import PlannerScreen from "../screens/coreScreens/PlannerScreen";
import BottomNavigationBar from "../components/navigation/BottomNavigationBar";
// Placeholder component for the "Add" tab
const AddPlaceholderScreen = () => <View />;

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavigationBar {...props} />} // Use the custom component
      screenOptions={{
        headerShown: false, // Hide the header
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      {/* Add the placeholder screen for the center button */}
      <Tab.Screen
        name="Add"
        component={AddPlaceholderScreen}
        options={{
          // Optional: Add specific options if needed, e.g., listeners
          // tabBarButton: () => null, // If the button itself handles navigation/action
        }}
      />
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
