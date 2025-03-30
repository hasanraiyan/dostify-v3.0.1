import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import BottomTabs from "./BottomTabs";
import ProfileScreen from "../screens/coreScreens/ProfileScreen";
import CustomDrawer from "../components/navigation/CustomDrawer";
import ResourcesScreen from "../screens/coreScreens/ResourcesScreen";
import MoodTrackerScreen from "../screens/coreScreens/MoodTrackerScreen";
import CrisisHelpScreen from "../screens/coreScreens/CrisisHelpScreen";
import PomodorosScreen from "../screens/coreScreens/PomodorosScreen";
import FeedbackScreen from "../screens/coreScreens/FeedbackScreen";
import SettingsScreen from "../screens/coreScreens/SettingsScreen";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="HomeTabs" component={BottomTabs} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Resources" component={ResourcesScreen} />
      <Drawer.Screen name="MoodTracker" component={MoodTrackerScreen} />
      <Drawer.Screen name="CrisisHelp" component={CrisisHelpScreen} />
      <Drawer.Screen name="Pomodoros" component={PomodorosScreen} />
      <Drawer.Screen name="Feedback" component={FeedbackScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />

    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
