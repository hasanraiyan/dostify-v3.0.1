
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View } from 'react-native';
import HomeScreen from "../screens/coreScreens/HomeScreen";
import ChatScreen from "../screens/coreScreens/ChatScreen";
import ProfileScreen from "../screens/coreScreens/ProfileScreen";
import PlannerScreen from "../screens/coreScreens/PlannerScreen";
import BottomNavigationBar from "../components/navigation/BottomNavigationBar";

const AddPlaceholderScreen = () => <View />;

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <BottomNavigationBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      { }
      <Tab.Screen
        name="Add"
        component={AddPlaceholderScreen}
        options={{


        }}
      />
      <Tab.Screen name="Planner" component={PlannerScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
