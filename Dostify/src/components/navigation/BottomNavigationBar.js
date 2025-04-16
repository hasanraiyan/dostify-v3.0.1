
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';




const COLORS = {
    primary: '#4A90E2',
    primaryLight: '#EAF2FB',
    secondary: '#50E3C2',
    secondaryLight: '#E0F8F5',
    accent: '#A060E0',
    accentLight: '#F1EBF9',
    success: '#34C759',
    successLight: '#E1F5EA',
    warning: '#FFCC00',
    warningLight: '#FFF9E6',
    danger: '#FF3B30',
    dangerLight: '#FFEBEA',
    white: '#FFFFFF',
    black: '#000000',
    grey: '#8E8E93',
    lightGrey: '#F2F2F7',
    darkGrey: '#333333',
    orange: '#FF9500',
};

const FONT_SIZES = {
    SMALL: 12,
    MEDIUM: 14,
    LARGE: 16,
    XLARGE: 18,
    XXLARGE: 24,
    HUGE: 28,
};

const FONT_FAMILY = {
    REGULAR: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    MEDIUM: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    BOLD: Platform.OS === 'ios' ? 'System' : 'sans-serif-bold',
};

const SPACING = {
    XSMALL: 4,
    SMALL: 8,
    MEDIUM: 12,
    LARGE: 16,
    XLARGE: 24,
    XXLARGE: 32,
};



const BottomNavigationBar = ({ state, descriptors, navigation }) => {

    const navItems = state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
            options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                    ? options.title
                    : route.name;


        let iconName = 'help-circle-outline';
        let activeIconName = 'help-circle';
        let isCenter = false;

        switch (route.name) {
            case 'Home':
                iconName = 'home-outline';
                activeIconName = 'home';
                break;
            case 'Chat':
                iconName = 'chat-processing-outline';
                activeIconName = 'chat-processing';
                break;
            case 'Add':
                iconName = 'plus';
                isCenter = true;
                break;
            case 'Planner':
                iconName = 'calendar-month-outline';
                activeIconName = 'calendar-month';
                break;
            case 'Profile':
                iconName = 'account-outline';
                activeIconName = 'account';
                break;
        }

        return {
            name: route.name,
            label: label,
            icon: iconName,
            activeIcon: activeIconName,
            isCenter: isCenter,
            key: route.key,
            index: index,
        };
    });


    const activeRouteIndex = state.index;


    const renderNavItem = (item) => {
        const isActive = activeRouteIndex === item.index;
        const color = isActive ? COLORS.primary : COLORS.grey;
        const iconName = isActive ? (item.activeIcon || item.icon) : item.icon;

        const onPress = () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: item.key,
                canPreventDefault: true,
            });

            if (!isActive && !event.defaultPrevented) {
                navigation.navigate(item.name);
            }
        };

        const onLongPress = () => {
            navigation.emit({
                type: 'tabLongPress',
                target: item.key,
            });
        };


        if (item.isCenter) {
            return (
                <TouchableOpacity
                    key={item.key}
                    style={styles.navButton}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    accessibilityRole="button"
                    accessibilityState={isActive ? { selected: true } : {}}
                    accessibilityLabel={descriptors[item.key].options.tabBarAccessibilityLabel}
                    testID={descriptors[item.key].options.tabBarTestID}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.secondary]}
                        style={styles.navButtonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <MaterialCommunityIcons name={item.icon} size={28} color={COLORS.white} />
                    </LinearGradient>
                    { }
                    { }
                </TouchableOpacity>
            );
        }


        return (
            <TouchableOpacity
                key={item.key}
                style={styles.navItem}
                onPress={onPress}
                onLongPress={onLongPress}
                accessibilityRole="button"
                accessibilityState={isActive ? { selected: true } : {}}
                accessibilityLabel={descriptors[item.key].options.tabBarAccessibilityLabel}
                testID={descriptors[item.key].options.tabBarTestID}
                activeOpacity={0.6}
            >
                <MaterialCommunityIcons name={iconName} size={24} color={color} />
                <Text style={[styles.navText, { color }]}>{item.label}</Text>
            </TouchableOpacity>
        );
    };


    const displayItems = navItems;




    const activeRouteName = state.routes[activeRouteIndex].name;
    const hideTabBar = activeRouteName === 'Chat' || activeRouteName === 'Planner';

    if (hideTabBar) {
        return null;
    }

    return (
        <View style={styles.bottomNav}>
            {displayItems.map(renderNavItem)}
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: Platform.OS === 'ios' ? 60 + SPACING.LARGE : 60,
        paddingBottom: Platform.OS === 'ios' ? SPACING.LARGE : 0,
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGrey,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: SPACING.SMALL,
        height: '100%',
    },
    navText: {
        fontSize: FONT_SIZES.SMALL,
        fontFamily: FONT_FAMILY.MEDIUM,
        marginTop: SPACING.XSMALL,
    },
    navButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    navButtonGradient: {
        width: 54,
        height: 54,
        borderRadius: 27,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: -SPACING.MEDIUM }],
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
});

export default BottomNavigationBar;