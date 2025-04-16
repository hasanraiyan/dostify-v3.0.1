import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Linking,
    Alert,
    ActivityIndicator,
    Dimensions,
    Platform,
    RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthContext } from '../../context/authContext';


const { width } = Dimensions.get('window');
const SPACING = { XSMALL: 4, SMALL: 8, MEDIUM: 12, LARGE: 16, XLARGE: 24, XXLARGE: 32, XXXLARGE: 40, };
const FONT_SIZES = { XSMALL: 10, SMALL: 12, MEDIUM: 14, LARGE: 17, XLARGE: 20, XXLARGE: 28, HUGE: 34, };
const FONT_WEIGHT = { REGULAR: '400', MEDIUM: '500', SEMIBOLD: '600', BOLD: '700', };
const FONT_FAMILY = Platform.OS === 'ios' ? 'System' : 'sans-serif';
const colors = { primary: '#007AFF', primaryLight: '#EBF5FF', secondary: '#34C759', secondaryLight: '#E1F5EA', accent: '#AF52DE', accentLight: '#F6EDFC', success: '#34C759', successLight: '#E1F5EA', warning: '#FF9500', warningLight: '#FFF9E6', danger: '#FF3B30', dangerLight: '#FFEBEA', white: '#FFFFFF', black: '#000000', grey: '#8E8E93', lightGrey: '#F2F2F7', mediumGrey: '#C7C7CC', background: '#F9F9F9', card: '#FFFFFF', text: '#1C1C1E', textSecondary: '#8E8E93', border: '#E5E5EA', error: '#FF3B30', };
const APP_INFO = { NAME: 'Dostify', VERSION: '1.0.0', COPYRIGHT_YEAR: new Date().getFullYear(), DEVELOPER: 'Dostify', DEVELOPER_LINK: 'https://dostify-climb.vercel.app', };
const defaultAvatar = require('../../../assets/android/mipmap-xxxhdpi/ic_launcher.png');

const getLevelInfo = (pts) => {
    const levels = [
        { number: 1, name: 'Beginner', minPoints: 0, nextLevelPoints: 100 },
        { number: 2, name: 'Explorer', minPoints: 100, nextLevelPoints: 300 },
        { number: 3, name: 'Innovator', minPoints: 300, nextLevelPoints: 600 },
        { number: 4, name: 'Trailblazer', minPoints: 600, nextLevelPoints: 1000 },
        { number: 5, name: 'Mentor', minPoints: 1000, nextLevelPoints: Infinity },
    ];
    let levelData = levels[0];
    for (let i = levels.length - 1; i >= 0; i--) {
        if (pts >= levels[i].minPoints) {
            levelData = levels[i];
            break;
        }
    }
    return levelData;
};


const fetchUserData = async () => {
    console.log("fetchUserData called");
    await new Promise(resolve => setTimeout(resolve, 1200));

    const points = 175;
    const consecutiveCheckInDays = 3;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);


    const lastCheckInDate = yesterday;





    today.setHours(0, 0, 0, 0);

    const isCheckedInToday = lastCheckInDate.getTime() === today.getTime();
    let actualConsecutiveDays = 0;
    const oneDay = 24 * 60 * 60 * 1000;


    if (lastCheckInDate.getTime() === today.getTime()) {

        actualConsecutiveDays = consecutiveCheckInDays;
    } else if (lastCheckInDate.getTime() === today.getTime() - oneDay) {

        actualConsecutiveDays = consecutiveCheckInDays;
    } else {

        actualConsecutiveDays = 0;
    }


    const dailyCheckInData = Array.from({ length: 7 }, (_, i) => ({
        day: i + 1,
        reward: 10 + i * 2,
        checked: !isCheckedInToday && (i + 1 <= actualConsecutiveDays),

        ...(isCheckedInToday && { checked: i + 1 <= actualConsecutiveDays }),
    }));

    const currentLevelData = getLevelInfo(points);

    const fetchedUserData = {
        id: 'user123',
        name: 'Raiyan Hasan',
        username: 'hasanraiyan',
        bio: 'Building Dostify v3. React Native enthusiast exploring AI integration. Passionate about mental wellness technology.',
        avatarUrl: `https://avatars.githubusercontent.com/u/143262732?s=400&u=217d826d2c7720ea0984e7d9adef340a521cca84&v=4`,
        email: 'raiyan@example.com',
        points: points,
        level: currentLevelData.name,
        levelNumber: currentLevelData.number,
        pointsForCurrentLevel: currentLevelData.minPoints,
        pointsForNextLevel: currentLevelData.nextLevelPoints,
        badges: 12,
        website: APP_INFO.DEVELOPER_LINK,

        consecutiveCheckInDays: actualConsecutiveDays,
        dailyCheckInData: dailyCheckInData,
        isCheckedInToday: isCheckedInToday,



    };
    console.log("fetchUserData - returning:", fetchedUserData.isCheckedInToday, fetchedUserData.consecutiveCheckInDays);
    return fetchedUserData;
};




const DailyCheckInSection = React.memo(({
    dailyCheckInData,
    consecutiveCheckInDays,
    isCheckedInToday,
    handleCheckIn,
}) => {


    if (!Array.isArray(dailyCheckInData)) {
        console.warn("DailyCheckInSection: Invalid or missing dailyCheckInData array.");

        return (
            <View style={[styles.dailyCheckInSection, { backgroundColor: colors.card, alignItems: 'center' }]}>
                <Text style={{ color: colors.textSecondary }}>Check-in data unavailable.</Text>
            </View>
        );
    }

    return (
        <View style={[styles.dailyCheckInSection, { backgroundColor: colors.card }]}>
            <View style={styles.checkInHeader}>
                <MaterialCommunityIcons name="calendar-check-outline" size={24} color={colors.primary} />
                <View style={styles.checkInHeaderText}>
                    <Text style={[styles.checkInTitle, { color: colors.text }]}>
                        Checked in for <Text style={{ fontWeight: FONT_WEIGHT.BOLD }}>{consecutiveCheckInDays ?? 0} consecutive days</Text>
                    </Text>
                    <Text style={[styles.checkInSubtitle, { color: colors.textSecondary }]}>
                        Keep the streak going for bigger rewards!
                    </Text>
                </View>
                
                <MaterialCommunityIcons name="calendar-heart" size={36} color={colors.primaryLight} style={styles.calendarHeartIcon} />
            </View>
            <View style={styles.daysRow}>
                {dailyCheckInData.map((dayInfo) => (
                    <View key={`day-${dayInfo.day}`} style={styles.dayItemContainer}>
                        <View style={[
                            styles.rewardCircle,
                            dayInfo.checked ? styles.rewardCircleChecked : styles.rewardCircleUnchecked
                        ]}>
                            {dayInfo.checked ? (
                                <MaterialCommunityIcons name="check-bold" size={16} color={colors.white} />
                            ) : (
                                <Text style={[styles.rewardText, { color: colors.textSecondary }]}>
                                    {dayInfo.reward}
                                </Text>
                            )}
                        </View>
                        <Text style={[
                            styles.dayLabel,
                            { color: dayInfo.checked ? colors.primary : colors.textSecondary }
                        ]}>
                            Day {dayInfo.day}
                        </Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity
                style={[
                    styles.checkInButton,
                    isCheckedInToday ? styles.checkInButtonDisabled : styles.checkInButtonEnabled
                ]}
                disabled={isCheckedInToday}
                onPress={handleCheckIn}
                activeOpacity={isCheckedInToday ? 1 : 0.7}
            >
                <Text style={[
                    styles.checkInButtonText,
                    { color: isCheckedInToday ? colors.grey : colors.white }
                ]}>
                    {isCheckedInToday ? 'Checked in Today' : 'Check in Now'}
                </Text>
            </TouchableOpacity>
        </View>
    );
});


const ProfileHeaderComponent = React.memo(({ userData, onEditProfile, onOpenLink }) => {

    if (!userData) {


        return (
            <View style={[styles.headerContainerRevamped, { backgroundColor: colors.card, height: 250 }]}>
                
                <ActivityIndicator color={colors.primary} style={{ marginTop: 100 }} />
            </View>
        );
    }

    return (
        <View style={[styles.headerContainerRevamped, { backgroundColor: colors.card }]}>
            
            <View style={styles.coverPhotoRevamped}>
                <LinearGradient
                    colors={[colors.primary, colors.accent]}
                    style={styles.coverGradientRevamped}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />
            </View>

            
            <View style={styles.headerContentRevamped}>
                
                <View style={styles.avatarContainerRevamped}>
                    <Image
                        source={userData.avatarUrl ? { uri: userData.avatarUrl } : defaultAvatar}
                        style={[styles.avatarRevamped, { borderColor: colors.white }]}
                        accessibilityLabel={`${userData.name || 'User'}'s avatar`}
                    />
                </View>

                
                <View style={styles.identityContainerRevamped}>
                    <Text style={[styles.nameRevamped, { color: colors.text }]} numberOfLines={1} ellipsizeMode="tail">
                        {userData.name || 'User Name'}
                    </Text>
                    <Text style={[styles.usernameRevamped, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="tail">
                        @{userData.username || 'username'}
                    </Text>
                </View>

                
                {userData.bio ? (
                    <Text style={[styles.bioRevamped, { color: colors.textSecondary }]} numberOfLines={3} ellipsizeMode="tail">
                        {userData.bio}
                    </Text>
                ) : null}

                
                {userData.website ? (
                    <TouchableOpacity
                        onPress={() => onOpenLink(userData.website)}
                        style={styles.websiteLinkRevamped}
                        accessibilityRole="link"
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="link-variant" size={16} color={colors.primary} />
                        <Text style={[styles.websiteTextRevamped, { color: colors.primary }]}>
                            {userData.website.replace(/^(https?:\/\/)/, '')}
                        </Text>
                    </TouchableOpacity>
                ) : null}

                
                <TouchableOpacity
                    style={[styles.editButtonRevamped, { backgroundColor: colors.primaryLight }]}
                    onPress={onEditProfile}
                    accessibilityRole="button"
                    accessibilityLabel="Edit Profile"
                    activeOpacity={0.7}
                >
                    <MaterialCommunityIcons name="pencil-outline" size={16} color={colors.primary} />
                    <Text style={[styles.editButtonTextRevamped, { color: colors.primary }]}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});
const ProfileHeader = ProfileHeaderComponent;



const ProfileScreen = ({ navigation }) => {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const { logout } = useAuthContext();


    const loadData = useCallback(async (isRefresh = false) => {
        if (!isRefresh) setIsLoading(true);
        else setIsRefreshing(true);
        setError(null);
        try {
            const data = await fetchUserData();
            setUserData(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(`Failed to load profile: ${errorMessage}`);
            console.error("Error fetching user data:", err);


        } finally {
            if (!isRefresh) setIsLoading(false);
            else setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);


    const handleEditProfile = useCallback(() => {
        if (userData) {
            console.log("Navigating to EditProfile with userData:", userData);

        } else {
            Alert.alert("Error", "User data not available to edit.");
        }
    }, [userData, navigation]);

    const handleLogout = useCallback(() => {
        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", style: "destructive", onPress: logout }
            ],
            { cancelable: true }
        );
    }, [logout]);

    const openLink = useCallback(async (url) => {
        if (!url) return;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            try {
                await Linking.openURL(url);
            } catch (err) {
                console.error("Failed to open URL:", err);
                Alert.alert('Error', 'Could not open the link.');
            }
        } else {
            Alert.alert('Unsupported Link', `Cannot open this URL: ${url}`);
        }
    }, []);

    const navigateTo = useCallback((screen, params = {}) => {
        console.log("Navigating to:", screen, "with params:", params);
        navigation.navigate(screen, params);
    }, [navigation]);

    const handleRetry = useCallback(() => {
        loadData();
    }, [loadData]);


    const handleCheckIn = useCallback(async () => {

        if (!userData || userData.isCheckedInToday) return;





        try {
            await new Promise(resolve => setTimeout(resolve, 400));


            const currentConsecutiveDays = userData.consecutiveCheckInDays ?? 0;
            const newConsecutiveDays = currentConsecutiveDays + 1;


            const todayRewardData = userData.dailyCheckInData?.[currentConsecutiveDays];
            const rewardPoints = todayRewardData?.reward || 10;

            const currentPoints = userData.points ?? 0;
            const newPoints = currentPoints + rewardPoints;
            const newLevelInfo = getLevelInfo(newPoints);


            const newDailyData = userData.dailyCheckInData?.map(d => ({
                ...d,
                checked: d.day <= newConsecutiveDays,
            })) || [];


            setUserData(prevData => ({
                ...prevData,
                points: newPoints,
                level: newLevelInfo.name,
                levelNumber: newLevelInfo.number,
                pointsForCurrentLevel: newLevelInfo.minPoints,
                pointsForNextLevel: newLevelInfo.nextLevelPoints,
                consecutiveCheckInDays: newConsecutiveDays,
                dailyCheckInData: newDailyData,
                isCheckedInToday: true,
            }));

            Alert.alert("Check-in Successful!", `You earned ${rewardPoints} points! Streak: ${newConsecutiveDays} days.`);

        } catch (err) {

            Alert.alert("Check-in Failed", "Could not check in. Please try again.");
            console.error("Check-in failed:", err);

        }
    }, [userData]);







    const StatsSection = React.memo(() => (
        <View style={[styles.statsContainer, { backgroundColor: colors.card }]}>
            
            <View style={styles.statItem}>
                <MaterialCommunityIcons name="star-circle-outline" size={22} color={colors.accent} style={styles.statIcon} />
                <View style={styles.statTextContainer}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{userData?.points ?? 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Points</Text>
                </View>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
                <MaterialCommunityIcons name="trophy-award" size={22} color={colors.warning} style={styles.statIcon} />
                <View style={styles.statTextContainer}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{userData?.level || 'Beginner'}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Level</Text>
                </View>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            
            <View style={styles.statItem}>
                <MaterialCommunityIcons name="seal-variant" size={22} color={colors.success} style={styles.statIcon} />
                <View style={styles.statTextContainer}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{userData?.badges ?? 0}</Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Badges</Text>
                </View>
            </View>
        </View>
    ));

    const AchievementsSection = React.memo(() => {

        const points = userData?.points ?? 0;
        const levelName = userData?.level || 'Beginner';
        const levelNumber = userData?.levelNumber || 1;
        const currentLevelPoints = userData?.pointsForCurrentLevel ?? 0;
        const nextLevelPoints = userData?.pointsForNextLevel ?? (currentLevelPoints + 100);


        const pointsInLevel = points - currentLevelPoints;
        const pointsRangeForLevel = nextLevelPoints === Infinity ? pointsInLevel : Math.max(1, nextLevelPoints - currentLevelPoints);
        const progressPercent = nextLevelPoints === Infinity
            ? 100
            : Math.max(0, Math.min(100, (pointsInLevel / pointsRangeForLevel) * 100));

        const pointsNeededText = nextLevelPoints === Infinity ? 'Max Level' : `${nextLevelPoints}`;
        const badgeCount = userData?.badges ?? 0;

        return (
            <View style={[styles.achievementsContainer, { backgroundColor: colors.card }]}>
                
                <View style={styles.achievementHeader}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Progress</Text>
                    
                    {(badgeCount > 0 || levelNumber > 1) && (
                        <TouchableOpacity onPress={() => {
                            console.log("Navigating to Achievements from Achievements Section");

                        }} activeOpacity={0.7}>
                            <Text style={[styles.seeAllText, { color: colors.primary }]}>Details</Text>
                        </TouchableOpacity>
                    )}
                </View>

                
                <View style={styles.levelProgressSection}>
                    <View style={styles.levelInfo}>
                        <View style={[styles.levelIconContainer, { backgroundColor: colors.warningLight }]}>
                            <MaterialCommunityIcons name="trophy-award" size={24} color={colors.warning} />
                        </View>
                        <View style={styles.levelTextContainer}>
                            <Text style={[styles.levelTitle, { color: colors.text }]}>Level {levelNumber}: {levelName}</Text>
                            <Text style={[styles.levelPointsDetails, { color: colors.textSecondary }]}>
                                {points} / {pointsNeededText} points
                            </Text>
                        </View>
                    </View>
                    <View style={[styles.progressContainer, { backgroundColor: colors.lightGrey }]}>
                        <LinearGradient
                            colors={progressPercent > 0 ? [colors.primaryLight, colors.primary] : [colors.lightGrey, colors.lightGrey]}
                            style={[styles.progressBar, { width: `${progressPercent}%` }]}
                            start={{ x: 0, y: 0.5 }}
                            end={{ x: 1, y: 0.5 }}
                        />
                    </View>
                </View>

                
                {badgeCount > 0 && (
                    <View style={styles.badgesSection}>
                        <Text style={[styles.badgesTitle, { color: colors.textSecondary }]}>Recent Badges ({badgeCount})</Text>
                        <View style={styles.badgesRow}>
                            
                            
                            <View style={[styles.badgeCircle, { backgroundColor: colors.successLight }]}><MaterialCommunityIcons name="check-decagram" size={20} color={colors.success} /></View>
                            <View style={[styles.badgeCircle, { backgroundColor: colors.warningLight }]}><MaterialCommunityIcons name="fire" size={20} color={colors.warning} /></View>
                            <View style={[styles.badgeCircle, { backgroundColor: colors.accentLight }]}><MaterialCommunityIcons name="star-four-points-outline" size={20} color={colors.accent} /></View>
                            {badgeCount >= 4 && <View style={[styles.badgeCircle, { backgroundColor: colors.primaryLight }]}><MaterialCommunityIcons name="account-heart-outline" size={20} color={colors.primary} /></View>}
                            
                            
                        </View>
                    </View>
                )}
            </View>
        );
    });


    const SettingsRow = React.memo(({ iconName, label, onPress, isDestructive = false }) => (
        <TouchableOpacity
            style={[styles.settingsRow, { borderBottomColor: colors.border }]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
            activeOpacity={0.7}
        >
            <View style={[
                styles.settingsIconContainer,
                { backgroundColor: isDestructive ? colors.dangerLight : colors.primaryLight }
            ]}>
                <MaterialCommunityIcons
                    name={iconName}
                    size={20}
                    color={isDestructive ? colors.danger : colors.primary}
                />
            </View>
            <Text style={[
                styles.settingsLabel,
                { color: isDestructive ? colors.danger : colors.text }
            ]}>
                {label}
            </Text>
            
            {!isDestructive && (
                <MaterialCommunityIcons name="chevron-right" size={22} color={colors.grey} />
            )}
        </TouchableOpacity>
    ));


    const SettingsSection = React.memo(() => (
        <View style={[styles.settingsSection, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, styles.settingsSectionTitle]}>Settings & More</Text>
            <SettingsRow iconName="bell-outline" label="Notifications" onPress={() => {
                console.log("Navigating to NotificationSettings from Settings Section");

            }} />
            <SettingsRow iconName="account-cog-outline" label="Learning Profile" onPress={() => {
                console.log("Navigating to LearningProfile from Settings Section");

            }} />
            <SettingsRow iconName="shield-lock-outline" label="Security & Account" onPress={() => {
                console.log("Navigating to SecuritySettings from Settings Section");

            }} />
            <SettingsRow iconName="eye-off-outline" label="Privacy" onPress={() => {
                console.log("Navigating to PrivacySettings from Settings Section");

            }} />
            <SettingsRow iconName="palette-outline" label="Appearance" onPress={() => {
                console.log("Navigating to AppearanceSettings from Settings Section");

            }} />
            <SettingsRow iconName="lifebuoy" label="Crisis Resources" onPress={() => {
                console.log("Navigating to CrisisResources from Settings Section");

            }} />
            <SettingsRow iconName="information-outline" label="About Dostify" onPress={() => {
                console.log("Navigating to AboutApp from Settings Section");

            }} />
            <SettingsRow iconName="logout-variant" label="Logout" onPress={handleLogout} isDestructive={true} />
        </View>
    ));




    if (isLoading && !userData) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading Profile...</Text>
                </View>
            </SafeAreaView>
        );
    }


    if (error && !userData) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
                <View style={styles.errorContainer}>
                    <MaterialCommunityIcons name="alert-circle-outline" size={48} color={colors.danger} />
                    <Text style={[styles.errorText, { color: colors.danger }]}>Error Loading Profile</Text>
                    <Text style={[styles.errorDetails, { color: colors.textSecondary }]}>{error}</Text>
                    <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={handleRetry} activeOpacity={0.8}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }


    if (!userData && !isLoading) {
        return (
            <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
                <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
                <View style={styles.loadingContainer}>
                    <MaterialCommunityIcons name="account-question-outline" size={48} color={colors.grey} />
                    <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Could not load profile data.</Text>
                    <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary, marginTop: SPACING.XLARGE }]} onPress={handleRetry} activeOpacity={0.8}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }



    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <StatusBar barStyle='dark-content' backgroundColor={colors.background} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => loadData(true)}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            >
                
                {userData && (
                    <>
                        
                        <ProfileHeader
                            userData={userData}
                            onEditProfile={handleEditProfile}
                            onOpenLink={openLink}
                        />
                        <StatsSection />
                        
                        <DailyCheckInSection
                            dailyCheckInData={userData.dailyCheckInData}
                            consecutiveCheckInDays={userData.consecutiveCheckInDays}
                            isCheckedInToday={userData.isCheckedInToday}
                            handleCheckIn={handleCheckIn}
                        />
                        <AchievementsSection />
                        <SettingsSection />
                    </>
                )}
                
                {!userData && !isLoading && !error && (
                    <View style={styles.loadingContainer}>
                        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Profile data not available.</Text>
                    </View>
                )}


                
                <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                    {APP_INFO.NAME} v{APP_INFO.VERSION}
                    {'\n'}
                    © {APP_INFO.COPYRIGHT_YEAR} {APP_INFO.DEVELOPER}
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};


const cardShadowStyle = Platform.select({
    ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    android: {
        elevation: 3,
    },
});

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.LARGE,
    },
    loadingText: {
        marginTop: SPACING.MEDIUM,
        fontSize: FONT_SIZES.MEDIUM,
        fontFamily: FONT_FAMILY,
        color: colors.textSecondary,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.XXLARGE,
    },
    errorText: {
        marginTop: SPACING.MEDIUM,
        fontSize: FONT_SIZES.LARGE,
        fontWeight: FONT_WEIGHT.SEMIBOLD,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,

    },
    errorDetails: {
        marginTop: SPACING.SMALL,
        fontSize: FONT_SIZES.MEDIUM,
        textAlign: 'center',
        fontFamily: FONT_FAMILY,
        color: colors.grey,
        lineHeight: FONT_SIZES.MEDIUM * 1.4,
    },
    retryButton: {
        marginTop: SPACING.XLARGE,
        paddingVertical: SPACING.MEDIUM,
        paddingHorizontal: SPACING.XLARGE,
        borderRadius: SPACING.LARGE,
        alignItems: 'center',

    },
    retryButtonText: {
        color: colors.white,
        fontWeight: FONT_WEIGHT.SEMIBOLD,
        fontSize: FONT_SIZES.MEDIUM,
        fontFamily: FONT_FAMILY,
    },
    scrollView: {
        flex: 1,

    },
    scrollViewContent: {
        paddingBottom: SPACING.XXXLARGE,
    },



    headerContainerRevamped: {
        marginHorizontal: SPACING.MEDIUM,
        marginTop: SPACING.SMALL,
        marginBottom: SPACING.MEDIUM,
        borderRadius: SPACING.MEDIUM,
        backgroundColor: colors.card,
        ...cardShadowStyle,
        overflow: 'hidden',
    },
    coverPhotoRevamped: {
        height: 130,
        width: '100%',
    },
    coverGradientRevamped: {
        flex: 1,
    },
    headerContentRevamped: {
        alignItems: 'center',
        paddingBottom: SPACING.LARGE,
        marginTop: -50,
    },
    avatarContainerRevamped: {

        marginBottom: SPACING.SMALL,
    },
    avatarRevamped: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 4,
        borderColor: colors.white,
        backgroundColor: colors.lightGrey,

        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 4,
    },
    identityContainerRevamped: {
        alignItems: 'center',
        marginBottom: SPACING.MEDIUM,
    },
    nameRevamped: {
        fontSize: FONT_SIZES.XLARGE,
        fontWeight: FONT_WEIGHT.BOLD,
        fontFamily: FONT_FAMILY,
        marginBottom: SPACING.XSMALL,
    },
    usernameRevamped: {
        fontSize: FONT_SIZES.MEDIUM,
        fontFamily: FONT_FAMILY,
    },
    bioRevamped: {
        fontSize: FONT_SIZES.MEDIUM,
        lineHeight: FONT_SIZES.MEDIUM * 1.4,
        fontFamily: FONT_FAMILY,
        textAlign: 'center',
        marginHorizontal: SPACING.XLARGE,
        marginBottom: SPACING.MEDIUM,
    },
    websiteLinkRevamped: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.LARGE,
    },
    websiteTextRevamped: {
        fontSize: FONT_SIZES.SMALL,
        marginLeft: SPACING.XSMALL,
        fontWeight: FONT_WEIGHT.MEDIUM,
        fontFamily: FONT_FAMILY,
    },
    editButtonRevamped: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.SMALL + 2,
        paddingHorizontal: SPACING.XLARGE,
        borderRadius: SPACING.LARGE,

    },
    editButtonTextRevamped: {
        fontWeight: FONT_WEIGHT.SEMIBOLD,
        fontSize: FONT_SIZES.SMALL,
        marginLeft: SPACING.SMALL,
        fontFamily: FONT_FAMILY,
    },
    statsContainer: {
        flexDirection: 'row',
        marginHorizontal: SPACING.MEDIUM,
        marginTop: 0,
        borderRadius: SPACING.MEDIUM,
        paddingVertical: SPACING.LARGE,
        paddingHorizontal: SPACING.SMALL,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.card,
        ...cardShadowStyle,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.XSMALL,
    },
    statIcon: {
        marginRight: SPACING.SMALL,
    },
    statTextContainer: {
        alignItems: 'flex-start',
    },
    statValue: {
        fontSize: FONT_SIZES.LARGE,
        fontWeight: FONT_WEIGHT.BOLD,
        fontFamily: FONT_FAMILY,
    },
    statLabel: {
        fontSize: FONT_SIZES.SMALL,
        fontFamily: FONT_FAMILY,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: '60%',
        backgroundColor: colors.border,
        alignSelf: 'center',
    },
    dailyCheckInSection: {
        marginHorizontal: SPACING.MEDIUM,
        marginTop: SPACING.MEDIUM,
        borderRadius: SPACING.MEDIUM,
        padding: SPACING.LARGE,
        backgroundColor: colors.card,
        ...cardShadowStyle,
    },
    checkInHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.LARGE,
    },
    checkInHeaderText: {
        flex: 1,
        marginLeft: SPACING.MEDIUM,
        marginRight: SPACING.SMALL
    },
    checkInTitle: {
        fontSize: FONT_SIZES.MEDIUM,
        fontWeight: FONT_WEIGHT.MEDIUM,
        fontFamily: FONT_FAMILY,
        marginBottom: 2,
        color: colors.text,
    },
    checkInSubtitle: {
        fontSize: FONT_SIZES.SMALL,
        fontFamily: FONT_FAMILY,
        color: colors.textSecondary
    },
    calendarHeartIcon: {
        opacity: 0.8,
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.XLARGE,
        paddingHorizontal: SPACING.XSMALL,
    },
    dayItemContainer: {
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 2,
    },
    rewardCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        marginBottom: SPACING.SMALL,
    },
    rewardCircleChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    rewardCircleUnchecked: {
        backgroundColor: colors.lightGrey,
        borderColor: colors.border,
    },
    rewardText: {
        fontSize: FONT_SIZES.SMALL,
        fontWeight: FONT_WEIGHT.SEMIBOLD,
        fontFamily: FONT_FAMILY,
    },
    dayLabel: {
        fontSize: FONT_SIZES.SMALL,
        fontFamily: FONT_FAMILY,
        textAlign: 'center',
    },
    checkInButton: {
        paddingVertical: SPACING.MEDIUM,
        borderRadius: SPACING.LARGE,
        alignItems: 'center',
    },
    checkInButtonEnabled: {
        backgroundColor: colors.primary,
    },
    checkInButtonDisabled: {
        backgroundColor: colors.mediumGrey,
    },
    checkInButtonText: {
        fontSize: FONT_SIZES.MEDIUM,
        fontWeight: FONT_WEIGHT.BOLD,
        fontFamily: FONT_FAMILY,
    },
    achievementsContainer: {
        marginHorizontal: SPACING.MEDIUM,
        marginTop: SPACING.MEDIUM,
        borderRadius: SPACING.MEDIUM,
        paddingTop: SPACING.LARGE,
        paddingBottom: SPACING.LARGE,
        paddingHorizontal: SPACING.LARGE,
        backgroundColor: colors.card,
        ...cardShadowStyle,
    },
    achievementHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.LARGE,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.LARGE,
        fontWeight: FONT_WEIGHT.BOLD,
        fontFamily: FONT_FAMILY,
        color: colors.text,
    },
    seeAllText: {
        fontSize: FONT_SIZES.SMALL,
        fontWeight: FONT_WEIGHT.SEMIBOLD,
        fontFamily: FONT_FAMILY,
        color: colors.primary,
    },
    levelProgressSection: {
        marginBottom: SPACING.XLARGE,
    },
    levelInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.MEDIUM,
    },
    levelIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.MEDIUM,
    },
    levelTextContainer: {
        flex: 1,
    },
    levelTitle: {
        fontSize: FONT_SIZES.MEDIUM,
        fontWeight: FONT_WEIGHT.SEMIBOLD,
        fontFamily: FONT_FAMILY,
        marginBottom: 2,
    },
    levelPointsDetails: {
        fontSize: FONT_SIZES.SMALL,
        fontFamily: FONT_FAMILY,
        color: colors.textSecondary
    },
    progressContainer: {
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.lightGrey,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 5,
    },
    badgesSection: {
        marginTop: SPACING.MEDIUM,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: colors.border,
        paddingTop: SPACING.LARGE,
    },
    badgesTitle: {
        fontSize: FONT_SIZES.SMALL,
        fontWeight: FONT_WEIGHT.MEDIUM,
        marginBottom: SPACING.MEDIUM,
        fontFamily: FONT_FAMILY,
        color: colors.textSecondary,
    },
    badgesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    badgeCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.MEDIUM,
        marginBottom: SPACING.SMALL,
    },
    moreBadgesText: {
        fontSize: FONT_SIZES.SMALL,
        fontWeight: FONT_WEIGHT.BOLD,
        fontFamily: FONT_FAMILY,
    },
    settingsSection: {
        marginHorizontal: SPACING.MEDIUM,
        marginTop: SPACING.LARGE,
        borderRadius: SPACING.MEDIUM,
        overflow: 'hidden',
        backgroundColor: colors.card,
        ...cardShadowStyle,
        marginBottom: SPACING.MEDIUM,
    },
    settingsSectionTitle: {
        color: colors.text,
        paddingLeft: SPACING.LARGE,
        paddingTop: SPACING.LARGE,
        paddingBottom: SPACING.MEDIUM
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.MEDIUM + 2,
        paddingHorizontal: SPACING.LARGE,
        borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: colors.card,
        borderBottomColor: colors.border,
    },
    settingsIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.MEDIUM,
    },
    settingsLabel: {
        flex: 1,
        fontSize: FONT_SIZES.MEDIUM,
        fontFamily: FONT_FAMILY,
    },
    footerText: {
        marginTop: SPACING.XXLARGE,
        marginBottom: SPACING.LARGE,
        textAlign: 'center',
        fontSize: FONT_SIZES.SMALL,
        paddingHorizontal: SPACING.MEDIUM,
        lineHeight: FONT_SIZES.SMALL * 1.5,
        fontFamily: FONT_FAMILY,
    },
});

export default ProfileScreen;