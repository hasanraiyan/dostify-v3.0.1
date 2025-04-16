import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  Modal,
  Platform,
  Switch,
  Dimensions,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';


const COLORS = {
  primary: '#007AFF',
  primaryLight: '#EBF5FF',
  secondary: '#34C759',
  secondaryLight: '#E1F5EA',
  accent: '#AF52DE',
  accentLight: '#F6EDFC',
  success: '#34C759',
  successLight: '#E1F5EA',
  warning: '#FF9500',
  warningLight: '#FFF9E6',
  danger: '#FF3B30',
  dangerLight: '#FFEBEA',
  white: '#FFFFFF',
  black: '#000000',
  grey: '#8E8E93',
  lightGrey: '#F2F2F7',
  mediumGrey: '#E5E5EA',
  darkGrey: '#1C1C1E',
  background: '#F9F9F9',
  offWhite: '#F0F0F0',
};

const FONT_SIZES = {
  SMALL: 12,
  MEDIUM: 14,
  LARGE: 17,
  XLARGE: 20,
  XXLARGE: 28,
  HUGE: 34,
};

const FONT_WEIGHT = {
  REGULAR: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
};

const FONT_FAMILY = Platform.OS === 'ios' ? 'System' : 'sans-serif';

const SPACING = {
  XSMALL: 4,
  SMALL: 8,
  MEDIUM: 12,
  LARGE: 16,
  XLARGE: 24,
  XXLARGE: 32,
  XXXLARGE: 40,
};

const { width, height } = Dimensions.get('window');

const TASK_CATEGORIES = [
  { id: '1', name: 'Academic', icon: 'school-outline', color: COLORS.primary },
  { id: '2', name: 'Self-Care', icon: 'heart-outline', color: COLORS.accent },
  { id: '3', name: 'Career', icon: 'briefcase-outline', color: COLORS.warning },
  { id: '4', name: 'Social', icon: 'people-outline', color: COLORS.secondary },
  { id: '5', name: 'Other', icon: 'ellipse-outline', color: COLORS.grey },
];

const PRIORITIES = [
  { id: 'low', name: 'Low', color: COLORS.secondary },
  { id: 'medium', name: 'Medium', color: COLORS.warning },
  { id: 'high', name: 'High', color: COLORS.danger },
];


const PlannerScreen = () => {
  const navigation = useNavigation();


  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const [calendarMonthYear, setCalendarMonthYear] = useState(new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' }));

  const initialNewTaskState = {
    title: '',
    description: '',
    category: TASK_CATEGORIES[0].id,
    priority: PRIORITIES[1].id,
    dateTime: new Date(),
    reminder: true,
    completed: false,
  };
  const [newTask, setNewTask] = useState(initialNewTaskState);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date');
  const [pickerDate, setPickerDate] = useState(new Date());


  useEffect(() => {
    const initialDateStr = new Date().toISOString().split('T')[0];
    const initialDateTimeForTasks = new Date(initialDateStr + 'T09:00:00');


    const dummyTasks = [
      {
        id: '1',
        title: 'Study for Math Exam',
        description: 'Review chapters 5-7. Focus on integration techniques.',
        category: '1',
        priority: 'high',
        dateTime: new Date(initialDateStr + 'T10:00:00').toISOString(),
        reminder: true,
        completed: false
      },
      {
        id: '2',
        title: 'Meditation Session',
        description: '15 minutes mindfulness practice using Calm app.',
        category: '2',
        priority: 'medium',
        dateTime: new Date(initialDateStr + 'T08:00:00').toISOString(),
        reminder: true,
        completed: true
      },
      {
        id: '3',
        title: 'Update Resume',
        description: 'Add recent project experience and tailor for SWE roles.',
        category: '3',
        priority: 'low',
        dateTime: new Date(initialDateStr + 'T15:30:00').toISOString(),
        reminder: false,
        completed: false
      },
      {
        id: '4',
        title: 'Call Grandma',
        description: '',
        category: '4',
        priority: 'medium',
        dateTime: new Date(initialDateStr + 'T19:00:00').toISOString(),
        reminder: true,
        completed: false
      }
    ];
    setTasks(dummyTasks);

    setNewTask({ ...initialNewTaskState, dateTime: initialDateTimeForTasks });
    setPickerDate(initialDateTimeForTasks);

    const suggestions = [
      { id: 's1', title: 'Take a 10-min walk', description: 'Stretch and get fresh air', type: 'wellness' },
      { id: 's2', title: 'Review Lecture Notes', description: 'Consolidate learning', type: 'academic' },
      { id: 's3', title: 'Plan Weekend Activities', description: 'Organize social events', type: 'social' },
    ];
    setAiSuggestions(suggestions);

    updateMarkedDates(dummyTasks, initialDateStr);
  }, []);

  useEffect(() => {
    updateMarkedDates(tasks, selectedDate);
  }, [tasks, selectedDate]);


  const formatDate = (date) => {
    if (!date || !(date instanceof Date)) return '';
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date) => {
    if (!date || !(date instanceof Date)) return '00:00';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getDatePart = (dateTimeInput) => {
    if (!dateTimeInput) return '';
    try {
      const date = typeof dateTimeInput === 'string' ? new Date(dateTimeInput) : dateTimeInput;
      if (isNaN(date.getTime())) return '';
      return formatDate(date);
    } catch (error) { console.error("Error parsing date in getDatePart:", error); return ''; }
  };

  const getTimePart = (dateTimeInput) => {
    if (!dateTimeInput) return '00:00';
    try {
      const date = typeof dateTimeInput === 'string' ? new Date(dateTimeInput) : dateTimeInput;
      if (isNaN(date.getTime())) return '00:00';
      return formatTime(date);
    } catch (error) { console.error("Error parsing date in getTimePart:", error); return '00:00'; }
  };

  const getCategoryById = (id) => TASK_CATEGORIES.find(c => c.id === id) || TASK_CATEGORIES[TASK_CATEGORIES.length - 1];
  const getPriorityById = (id) => PRIORITIES.find(p => p.id === id) || PRIORITIES[0];


  const updateMarkedDates = (taskList, currentSelectedDateStr) => {
    const dates = {};
    taskList.forEach(task => {
      const taskDateStr = getDatePart(task.dateTime);
      if (taskDateStr) {
        dates[taskDateStr] = {
          ...(dates[taskDateStr] || {}),
          marked: true,
          dotColor: COLORS.primary
        };
      }
    });

    dates[currentSelectedDateStr] = {
      ...(dates[currentSelectedDateStr] || {}),
      selected: true,
      selectedColor: COLORS.primary,
      selectedTextColor: COLORS.white,
    };

    setMarkedDates(dates);
  };

  const onDayPress = useCallback((day) => {
    const newSelectedDateStr = day.dateString;
    setSelectedDate(newSelectedDateStr);

    const currentTime = newTask.dateTime || new Date();
    const newDateTime = new Date(`${newSelectedDateStr}T${formatTime(currentTime)}`);

    setNewTask(prev => ({ ...prev, dateTime: newDateTime }));
    setPickerDate(newDateTime);
  }, [newTask.dateTime]);

  const addTask = () => {
    if (newTask.title.trim() === '') {
      Alert.alert('Missing Title', 'Please enter a title for your task.');
      return;
    }

    const taskToAdd = {
      id: Date.now().toString(),
      title: newTask.title.trim(),
      description: newTask.description.trim(),
      category: newTask.category,
      priority: newTask.priority,
      dateTime: newTask.dateTime.toISOString(),
      reminder: newTask.reminder,
      completed: false,
    };

    const updatedTasks = [...tasks, taskToAdd];
    setTasks(updatedTasks);
    setModalVisible(false);

    const nextDefaultDateTime = new Date(selectedDate + 'T09:00:00');
    setNewTask({ ...initialNewTaskState, dateTime: nextDefaultDateTime });
    setPickerDate(nextDefaultDateTime);
  };

  const toggleTaskCompletion = (id) => {
    let completedTaskTitle = '';
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        const updatedTask = { ...task, completed: !task.completed };
        if (updatedTask.completed) completedTaskTitle = updatedTask.title;
        return updatedTask;
      }
      return task;
    });
    setTasks(updatedTasks);
  };


  const handleMonthChange = useCallback((month) => {
    if (month && month.monthNames && Array.isArray(month.monthNames) && month.month > 0 && month.month <= 12) {
      setCalendarMonthYear(`${month.monthNames[month.month - 1]} ${month.year}`);
    } else {
      console.warn("Invalid month object received in handleMonthChange:", month);


    }
  }, []);



  const showMode = (currentMode) => {
    setPickerMode(currentMode);
    setPickerDate(newTask.dateTime || new Date());
    setShowPicker(true);
  };

  const showDatepicker = () => showMode('date');
  const showTimepicker = () => showMode('time');

  const onPickerChange = (event, selectedValue) => {
    const currentValue = selectedValue || pickerDate;

    setShowPicker(Platform.OS === 'ios');

    if (event.type === 'set' || (Platform.OS === 'android' && selectedValue)) {
      setPickerDate(currentValue);
      setNewTask({ ...newTask, dateTime: currentValue });
    } else {
      if (Platform.OS === 'android') setShowPicker(false);
    }
  };

  const dismissIosPicker = () => {
    setShowPicker(false);
  }



  const filteredTasks = tasks.filter(task => getDatePart(task.dateTime) === selectedDate);

  const sortedFilteredTasks = filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) { return a.completed ? 1 : -1; }
    try {
      const dateA = new Date(a.dateTime); const dateB = new Date(b.dateTime);
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0;
      return dateA.getTime() - dateB.getTime();
    } catch (error) { console.error("Error sorting tasks by time:", error); return 0; }
  });




  const renderTaskItem = ({ item }) => {
    const category = getCategoryById(item.category);
    const priority = getPriorityById(item.priority);
    const taskTime = getTimePart(item.dateTime);

    return (
      <TouchableOpacity
        style={[
          styles.taskItem,
          item.completed && styles.taskItemCompleted,
          { borderLeftColor: category.color }
        ]}
        onPress={() => toggleTaskCompletion(item.id)}
        activeOpacity={0.7}
      >

        <TouchableOpacity
          style={styles.taskCheckboxArea}
          onPress={() => toggleTaskCompletion(item.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={[styles.checkbox, item.completed && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}>
            {item.completed && <Ionicons name="checkmark" size={18} color={COLORS.white} />}
          </View>
        </TouchableOpacity>


        <View style={styles.taskContent}>

          <View style={styles.taskHeader}>
            <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={[styles.priorityBadge, { backgroundColor: priority.color + '20' }]}>
              <View style={[styles.priorityDotSmall, { backgroundColor: priority.color }]} />
              <Text style={[styles.priorityText, { color: priority.color }]}>{priority.name}</Text>
            </View>
          </View>


          {item.description ? (
            <Text style={[styles.taskDescription, item.completed && styles.taskDescriptionCompleted]} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}


          <View style={styles.taskFooter}>

            <View style={styles.taskInfoChip}>
              <Ionicons name="time-outline" size={14} color={COLORS.grey} style={styles.footerIcon} />
              <Text style={styles.taskInfoText}>{taskTime}</Text>
            </View>

            <View style={[styles.taskInfoChip, { backgroundColor: category.color + '15' }]}>
              <Ionicons name={category.icon} size={14} color={category.color} style={styles.footerIcon} />
              <Text style={[styles.taskInfoText, { color: category.color }]}>{category.name}</Text>
            </View>

            {item.reminder && !item.completed && (
              <View style={styles.taskInfoChip}>
                <Ionicons name="notifications-outline" size={14} color={COLORS.grey} style={styles.footerIcon} />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSuggestionItem = ({ item }) => {
    const iconMap = { academic: 'school-outline', wellness: 'leaf-outline', career: 'briefcase-outline', social: 'people-outline', other: 'help-circle-outline' };
    const colorMap = { academic: COLORS.primary, wellness: COLORS.secondary, career: COLORS.warning, social: COLORS.accent, other: COLORS.grey };
    const iconName = iconMap[item.type] || iconMap.other;
    const iconColor = colorMap[item.type] || colorMap.other;

    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => {
          Alert.alert(
            'Use Suggestion?',
            `Add "${item.title}" as a new task for ${new Date(selectedDate + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at 12:00 PM?`,
            [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Add Task',
                onPress: () => {
                  const categoryMap = { academic: '1', wellness: '2', career: '3', social: '4' };
                  const suggestedCategory = categoryMap[item.type] || '5';
                  const suggestionDateTime = new Date(selectedDate + 'T12:00:00');

                  setNewTask({
                    ...initialNewTaskState,
                    title: item.title,
                    description: item.description,
                    category: suggestedCategory,
                    dateTime: suggestionDateTime,
                    priority: 'medium',
                    reminder: false,
                  });
                  setPickerDate(suggestionDateTime);
                  setModalVisible(true);
                }
              }
            ]
          );
        }}
        activeOpacity={0.8}
      >
        <View style={[styles.suggestionIconContainer, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>
        <View style={styles.suggestionContent}>
          <Text style={styles.suggestionTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.suggestionDescription} numberOfLines={1}>{item.description}</Text>
        </View>
        <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
      </TouchableOpacity>
    );
  };

  const generateMiniCalendarDays = (centerDateStr) => {
    const days = [];
    const centerDate = new Date(centerDateStr + 'T12:00:00');
    if (isNaN(centerDate.getTime())) return [];
    const todayStr = formatDate(new Date());

    for (let i = -3; i <= 3; i++) {
      const date = new Date(centerDate);
      date.setDate(date.getDate() + i);
      days.push({ date, isToday: formatDate(date) === todayStr });
    }
    return days;
  };
  const miniCalendarDays = generateMiniCalendarDays(selectedDate);



  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />


      <View style={styles.header}>
        <View style={styles.headerSide}>
          <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.headerButton}>
            <Ionicons name="menu-outline" size={28} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.calendarToggle} onPress={() => setCalendarExpanded(!calendarExpanded)}>
          <Ionicons name="calendar-outline" size={24} color={COLORS.primary} style={styles.calendarIcon} />
          <Text style={styles.headerTitle}>
            {calendarMonthYear}
          </Text>
          <Ionicons name={calendarExpanded ? "chevron-up-circle-outline" : "chevron-down-circle-outline"} size={20} color={COLORS.grey} style={{ marginLeft: SPACING.SMALL }} />
        </TouchableOpacity>
        <View style={[styles.headerSide, styles.headerSideRight]}>
          <TouchableOpacity style={styles.headerButton} onPress={() => Alert.alert("Search", "Search functionality to be implemented.")}>
            <Ionicons name="search-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, { marginLeft: SPACING.SMALL }]} onPress={() => setCalendarExpanded(!calendarExpanded)}>
            <Ionicons name="today-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        <View style={styles.calendarContainer}>
          {calendarExpanded ? (
            <Calendar
              current={selectedDate}
              onDayPress={onDayPress}
              markedDates={markedDates}
              monthFormat={'MMMM yyyy'}
              hideExtraDays={true}
              enableSwipeMonths={true}
              theme={styles.calendarTheme}
              style={styles.fullCalendar}
              firstDay={1}

              onMonthChange={handleMonthChange}
            />
          ) : (
            <View style={styles.miniCalendar}>
              {miniCalendarDays.map(({ date, isToday }) => {
                const dateString = formatDate(date);
                if (!dateString) return null;
                const isSelected = dateString === selectedDate;
                const dayOfMonth = date.getDate();
                const dayOfWeek = date.toLocaleDateString('default', { weekday: 'short' });

                return (
                  <TouchableOpacity
                    key={dateString}
                    style={[
                      styles.dayItem,
                      isSelected && styles.selectedDayItem,
                      isToday && !isSelected && styles.todayDayItem
                    ]}
                    onPress={() => onDayPress({ dateString })}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.weekdayText,
                      isSelected && styles.selectedDayText,
                      isToday && !isSelected && styles.todayDayText
                    ]}>
                      {dayOfWeek.toUpperCase()}
                    </Text>
                    <Text style={[
                      styles.dayText,
                      isSelected && styles.selectedDayText,
                      isToday && !isSelected && styles.todayDayText
                    ]}>
                      {dayOfMonth}
                    </Text>
                    {markedDates[dateString]?.marked && !isSelected && (
                      <View style={[styles.miniCalendarDot, isToday && { backgroundColor: COLORS.primary }]} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>


        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconWrapper, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="list-outline" size={20} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.summaryCount}>{filteredTasks.length}</Text>
              <Text style={styles.summaryLabel}>Tasks</Text>
            </View>
          </View>
          <View style={styles.summarySeparator} />
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconWrapper, { backgroundColor: COLORS.successLight }]}>
              <Ionicons name="checkmark-done-outline" size={20} color={COLORS.success} />
            </View>
            <View>
              <Text style={styles.summaryCount}>{filteredTasks.filter(t => t.completed).length}</Text>
              <Text style={styles.summaryLabel}>Done</Text>
            </View>
          </View>
          <View style={styles.summarySeparator} />
          <View style={styles.summaryItem}>
            <View style={[styles.summaryIconWrapper, { backgroundColor: COLORS.dangerLight }]}>
              <Ionicons name="flag-outline" size={20} color={COLORS.danger} />
            </View>
            <View>
              <Text style={styles.summaryCount}>{filteredTasks.filter(t => t.priority === 'high' && !t.completed).length}</Text>
              <Text style={styles.summaryLabel}>Urgent</Text>
            </View>
          </View>
        </View>


        {aiSuggestions.length > 0 && !calendarExpanded && (
          <View style={styles.suggestionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✨ Smart Suggestions</Text>
            </View>
            <FlatList
              data={aiSuggestions}
              renderItem={renderSuggestionItem}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsListContainer}
            />
          </View>
        )}


        <View style={styles.tasksSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedDate === formatDate(new Date()) ? "Today's Tasks" : `Tasks for ${new Date(selectedDate + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}`}
            </Text>
          </View>

          {sortedFilteredTasks.length > 0 ? (
            <FlatList
              data={sortedFilteredTasks}
              renderItem={renderTaskItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={{ height: SPACING.MEDIUM }} />}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Ionicons name="checkbox-outline" size={70} color={COLORS.mediumGrey} />
              <Text style={styles.emptyStateTitle}>All Clear!</Text>
              <Text style={styles.emptyStateText}>No tasks scheduled for this day.</Text>
              <TouchableOpacity style={styles.emptyStateButton} onPress={() => setModalVisible(true)}>
                <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} style={{ marginRight: SPACING.SMALL }} />
                <Text style={styles.emptyStateButtonText}>Add New Task</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>


        <View style={{ height: 120 }} />

      </ScrollView>


      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          const currentFormTime = newTask.dateTime || new Date();
          const initialModalDateTime = new Date(selectedDate + 'T12:00:00');
          initialModalDateTime.setHours(currentFormTime.getHours());
          initialModalDateTime.setMinutes(Math.ceil(currentFormTime.getMinutes() / 15) * 15);
          setNewTask(prev => ({ ...initialNewTaskState, dateTime: initialModalDateTime }));
          setPickerDate(initialModalDateTime);
          setModalVisible(true);
        }}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.accent]}
          style={styles.addButtonGradient}
          start={{ x: 0.1, y: 0.1 }} end={{ x: 0.9, y: 0.9 }}
        >
          <Ionicons name="add" size={30} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        >
          <View style={styles.modalOverlay}>

            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setModalVisible(false)} />
            <View style={styles.modalContent}>

              <View style={styles.modalHandle}></View>

              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Task</Text>
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                  <Ionicons name="close-circle" size={30} color={COLORS.mediumGrey} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Title *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g., Finish project proposal"
                    placeholderTextColor={COLORS.grey}
                    value={newTask.title}
                    onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                    autoFocus={true}
                    returnKeyType="next"
                  />
                </View>


                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Description</Text>
                  <TextInput
                    style={[styles.textInput, styles.textAreaInput]}
                    placeholder="Add details (optional)"
                    placeholderTextColor={COLORS.grey}
                    multiline={true}
                    value={newTask.description}
                    onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                  />
                </View>


                <View style={[styles.inputGroup, styles.dateTimeRow]}>
                  <View style={styles.pickerInputContainer}>
                    <Text style={styles.inputLabel}>Date</Text>
                    <TouchableOpacity style={styles.pickerButton} onPress={showDatepicker}>
                      <Ionicons name="calendar-outline" size={20} color={COLORS.grey} style={styles.pickerIcon} />
                      <Text style={styles.pickerButtonText}>
                        {newTask.dateTime.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.pickerInputContainer}>
                    <Text style={styles.inputLabel}>Time</Text>
                    <TouchableOpacity style={styles.pickerButton} onPress={showTimepicker}>
                      <Ionicons name="time-outline" size={20} color={COLORS.grey} style={styles.pickerIcon} />
                      <Text style={styles.pickerButtonText}>
                        {newTask.dateTime.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true })}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>


                {showPicker && (
                  <View>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={pickerDate}
                      mode={pickerMode}
                      is24Hour={false}
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={onPickerChange}
                      minimumDate={new Date(new Date().getFullYear() - 1, 0, 1)}
                      style={styles.dateTimePicker}
                    />

                    {showPicker && Platform.OS === 'ios' && pickerMode !== 'inline' && (
                      <TouchableOpacity style={styles.iosPickerDoneButton} onPress={dismissIosPicker}>
                        <Text style={styles.iosPickerDoneButtonText}>Done</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}



                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Category</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalSelector}>
                    {TASK_CATEGORIES.map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={[
                          styles.selectorChip,
                          newTask.category === category.id && styles.selectorChipSelected,
                          newTask.category === category.id && { backgroundColor: category.color + '20', borderColor: category.color }
                        ]}
                        onPress={() => setNewTask({ ...newTask, category: category.id })}
                        activeOpacity={0.7}
                      >
                        <Ionicons name={category.icon} size={16} color={newTask.category === category.id ? category.color : COLORS.grey} style={styles.selectorIcon} />
                        <Text style={[styles.selectorText, newTask.category === category.id && { color: category.color, fontWeight: FONT_WEIGHT.SEMIBOLD }]}>
                          {category.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>


                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Priority</Text>
                  <View style={styles.priorityContainer}>
                    {PRIORITIES.map((priority) => (
                      <TouchableOpacity
                        key={priority.id}
                        style={[
                          styles.prioritySegment,
                          newTask.priority === priority.id && styles.prioritySegmentSelected,
                          newTask.priority === priority.id && { backgroundColor: priority.color, borderColor: priority.color }
                        ]}
                        onPress={() => setNewTask({ ...newTask, priority: priority.id })}
                        activeOpacity={0.7}
                      >
                        {newTask.priority !== priority.id && <View style={[styles.priorityDot, { backgroundColor: priority.color }]} />}
                        <Text style={[styles.prioritySegmentText, newTask.priority === priority.id && styles.prioritySegmentTextSelected]}>
                          {priority.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>


                <View style={styles.inputGroup}>
                  <View style={styles.reminderContainer}>
                    <View style={styles.reminderLabelContainer}>
                      <Ionicons name="notifications-outline" size={20} color={COLORS.grey} style={styles.reminderIcon} />
                      <Text style={styles.inputLabelNoMargin}>Set Reminder</Text>
                    </View>
                    <Switch
                      trackColor={{ false: COLORS.mediumGrey, true: COLORS.primaryLight }}
                      thumbColor={newTask.reminder ? COLORS.primary : COLORS.lightGrey}
                      ios_backgroundColor={COLORS.mediumGrey}
                      onValueChange={() => setNewTask({ ...newTask, reminder: !newTask.reminder })}
                      value={newTask.reminder}
                      style={styles.reminderSwitch}
                    />
                  </View>
                </View>


                <View style={styles.aiSuggestionsBox}>
                  <View style={styles.aiSuggestionsHeader}>
                    <Ionicons name="sparkles-outline" size={18} color={COLORS.accent} />
                    <Text style={styles.aiSuggestionsTitle}>Quick Tip</Text>
                  </View>
                  <Text style={styles.aiSuggestionsText}>
                    Consider setting a specific time for important tasks to stay on track.
                  </Text>
                </View>


                <View style={{ height: SPACING.LARGE }} />

              </ScrollView>


              <View style={styles.modalFooter}>
                <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)} activeOpacity={0.7}>
                  <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.addTaskButton]} onPress={addTask} activeOpacity={0.8}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.accent]}
                    style={styles.modalButtonGradient}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                  >
                    <Ionicons name="checkmark" size={20} color={COLORS.white} style={{ marginRight: SPACING.SMALL }} />
                    <Text style={[styles.modalButtonText, styles.addTaskButtonText]}>Add Task</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.MEDIUM,
    paddingTop: Platform.OS === 'android' ? SPACING.LARGE : SPACING.SMALL,
    paddingBottom: SPACING.MEDIUM,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  headerSide: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 50,
  },
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  headerButton: {
    padding: SPACING.SMALL,
  },
  calendarToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    paddingHorizontal: SPACING.SMALL,
  },
  calendarIcon: {
    marginRight: SPACING.SMALL,
  },
  headerTitle: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.darkGrey,
    textAlign: 'center',
  },

  calendarContainer: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    paddingBottom: SPACING.SMALL,
  },
  fullCalendar: {},
  calendarTheme: {
    backgroundColor: COLORS.white,
    calendarBackground: COLORS.white,
    textSectionTitleColor: COLORS.grey,
    selectedDayBackgroundColor: COLORS.primary,
    selectedDayTextColor: COLORS.white,
    todayTextColor: COLORS.primary,
    dayTextColor: COLORS.darkGrey,
    textDisabledColor: COLORS.mediumGrey,
    dotColor: COLORS.primary,
    selectedDotColor: COLORS.white,
    arrowColor: COLORS.primary,
    monthTextColor: COLORS.darkGrey,
    indicatorColor: COLORS.primary,
    textDayFontFamily: FONT_FAMILY,
    textMonthFontFamily: FONT_FAMILY,
    textDayHeaderFontFamily: FONT_FAMILY,
    textDayFontWeight: FONT_WEIGHT.REGULAR,
    textMonthFontWeight: FONT_WEIGHT.SEMIBOLD,
    textDayHeaderFontWeight: FONT_WEIGHT.MEDIUM,
    textDayFontSize: FONT_SIZES.MEDIUM,
    textMonthFontSize: FONT_SIZES.LARGE,
    textDayHeaderFontSize: FONT_SIZES.SMALL,
  },
  miniCalendar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.SMALL,
  },
  dayItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width / 7 - SPACING.SMALL,
    maxWidth: 55,
    height: 65,
    borderRadius: SPACING.MEDIUM,
    backgroundColor: 'transparent',
    paddingVertical: SPACING.SMALL,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  selectedDayItem: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  todayDayItem: {
    borderColor: COLORS.primary,
  },
  weekdayText: {
    fontSize: FONT_SIZES.SMALL - 1,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.grey,
    marginBottom: SPACING.XSMALL,
    textTransform: 'uppercase',
  },
  dayText: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.darkGrey,
  },
  selectedDayText: {
    color: COLORS.white,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  todayDayText: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  miniCalendarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    bottom: 6,
  },

  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.LARGE,
    backgroundColor: COLORS.white,
    marginTop: SPACING.MEDIUM,
    marginHorizontal: SPACING.LARGE,
    borderRadius: SPACING.MEDIUM,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  summaryIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.SMALL,
  },
  summaryCount: {
    fontSize: FONT_SIZES.LARGE,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.darkGrey,
    lineHeight: FONT_SIZES.LARGE * 1.1,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    marginTop: 0,
  },
  summarySeparator: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.lightGrey,
  },

  suggestionsSection: {
    paddingTop: SPACING.LARGE,
    paddingBottom: SPACING.MEDIUM,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.MEDIUM,
    paddingHorizontal: SPACING.LARGE,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.darkGrey,
  },
  suggestionsListContainer: {
    paddingHorizontal: SPACING.LARGE,
    paddingVertical: SPACING.SMALL,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginRight: SPACING.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    width: width * 0.65,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  suggestionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.MEDIUM,
  },
  suggestionContent: {
    flex: 1,
    marginRight: SPACING.SMALL,
  },
  suggestionTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.darkGrey,
    marginBottom: 2,
  },
  suggestionDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
  },

  tasksSection: {
    paddingTop: SPACING.XLARGE,
    paddingHorizontal: SPACING.LARGE,
    flex: 1,
  },

  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: SPACING.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: SPACING.SMALL,
  },
  taskItemCompleted: {
    backgroundColor: COLORS.offWhite,
    opacity: 0.7,
  },
  taskCheckboxArea: {
    paddingRight: SPACING.MEDIUM,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.mediumGrey,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.XSMALL,
  },
  taskTitle: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.darkGrey,
    flexShrink: 1,
    marginRight: SPACING.SMALL,
    lineHeight: FONT_SIZES.MEDIUM * 1.4,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.grey,
    fontWeight: FONT_WEIGHT.REGULAR,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.SMALL,
    paddingVertical: 3,
    borderRadius: SPACING.LARGE,
    marginLeft: SPACING.SMALL,
    flexShrink: 0,
  },
  priorityDotSmall: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: SPACING.XSMALL,
  },
  priorityText: {
    fontSize: FONT_SIZES.SMALL - 1,
    fontWeight: FONT_WEIGHT.MEDIUM,
    textTransform: 'capitalize',
  },
  taskDescription: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.grey,
    marginBottom: SPACING.SMALL,
    marginTop: 2,
    lineHeight: FONT_SIZES.SMALL * 1.4,
  },
  taskDescriptionCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.mediumGrey,
  },
  taskFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: SPACING.XSMALL,
  },
  taskInfoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: SPACING.SMALL,
    paddingVertical: 4,
    paddingHorizontal: SPACING.SMALL,
    marginRight: SPACING.SMALL,
    marginBottom: SPACING.XSMALL,
  },
  footerIcon: {
    marginRight: SPACING.XSMALL,
    opacity: 0.8,
  },
  taskInfoText: {
    fontSize: FONT_SIZES.SMALL - 1,
    color: COLORS.grey,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.XXLARGE,
    marginTop: SPACING.XLARGE,
    minHeight: 200,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.darkGrey,
    marginBottom: SPACING.SMALL,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.grey,
    textAlign: 'center',
    marginBottom: SPACING.XLARGE,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.XLARGE,
    borderRadius: SPACING.LARGE,
  },
  emptyStateButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    color: COLORS.primary,
  },

  addButton: {
    position: 'absolute',
    bottom: SPACING.XLARGE,
    right: SPACING.LARGE,
    zIndex: 10,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  addButtonGradient: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SPACING.XLARGE,
    borderTopRightRadius: SPACING.XLARGE,
    paddingHorizontal: SPACING.LARGE,
    paddingTop: SPACING.SMALL,
    paddingBottom: Platform.OS === 'ios' ? SPACING.XXLARGE : SPACING.XLARGE,
    maxHeight: height * 0.85,
    minHeight: height * 0.4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: COLORS.mediumGrey,
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: SPACING.SMALL,
    marginBottom: SPACING.MEDIUM,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.MEDIUM,
    position: 'relative',
    marginBottom: SPACING.MEDIUM,
  },
  modalTitle: {
    fontSize: FONT_SIZES.XLARGE,
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.darkGrey,
    textAlign: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    right: -SPACING.SMALL,
    top: -SPACING.XSMALL,
    padding: SPACING.SMALL,
  },
  modalBody: {},
  inputGroup: {
    marginBottom: SPACING.LARGE,
  },
  inputLabel: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.grey,
    marginBottom: SPACING.SMALL,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputLabelNoMargin: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.darkGrey,
  },
  textInput: {
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: SPACING.MEDIUM,
    paddingVertical: SPACING.MEDIUM,
    borderRadius: SPACING.MEDIUM,
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.darkGrey,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    height: 50,
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.MEDIUM,
  },

  dateTimeRow: {
    flexDirection: 'row',
    gap: SPACING.MEDIUM,
  },
  pickerInputContainer: {
    flex: 1,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: SPACING.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    height: 50,
  },
  pickerIcon: {
    marginRight: SPACING.SMALL,
  },
  pickerButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.darkGrey,
    flex: 1,
  },
  dateTimePicker: {
    marginTop: SPACING.SMALL,
  },
  iosPickerDoneButton: {
    alignItems: 'flex-end',
    paddingVertical: SPACING.MEDIUM,
    paddingHorizontal: SPACING.MEDIUM,
    marginTop: SPACING.SMALL,
  },
  iosPickerDoneButtonText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.LARGE,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },

  horizontalSelector: {
    paddingVertical: SPACING.XSMALL,
  },
  selectorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    paddingVertical: SPACING.SMALL + 2,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: SPACING.LARGE,
    borderWidth: 1.5,
    borderColor: COLORS.lightGrey,
    marginRight: SPACING.SMALL,
  },
  selectorChipSelected: {
    borderWidth: 2,
  },
  selectorIcon: {
    marginRight: SPACING.SMALL,
  },
  selectorText: {
    fontSize: FONT_SIZES.SMALL,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.grey,
  },

  priorityContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGrey,
    borderRadius: SPACING.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    overflow: 'hidden',
    height: 50,
  },
  prioritySegment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: COLORS.mediumGrey,
    backgroundColor: 'transparent',
  },
  prioritySegmentSelected: {
    backgroundColor: COLORS.white,
    borderColor: 'transparent',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: SPACING.MEDIUM,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.SMALL,
  },
  prioritySegmentText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    color: COLORS.grey,
  },
  prioritySegmentTextSelected: {
    fontWeight: FONT_WEIGHT.BOLD,
    color: COLORS.darkGrey,
  },

  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: SPACING.MEDIUM,
    borderRadius: SPACING.MEDIUM,
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    height: 50,
  },
  reminderLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderIcon: {
    marginRight: SPACING.SMALL,
  },
  reminderSwitch: {
    transform: Platform.OS === 'ios' ? [{ scaleX: 0.9 }, { scaleY: 0.9 }] : [],
  },

  aiSuggestionsBox: {
    backgroundColor: COLORS.accentLight + '60',
    borderRadius: SPACING.MEDIUM,
    padding: SPACING.MEDIUM,
    marginTop: SPACING.SMALL,
    borderWidth: 1,
    borderColor: COLORS.accent + '30',
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiSuggestionsHeader: {
    marginRight: SPACING.MEDIUM,
  },
  aiSuggestionsTitle: {},
  aiSuggestionsText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.accent,
    lineHeight: FONT_SIZES.SMALL * 1.5,
    flex: 1,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },

  modalFooter: {
    flexDirection: 'row',
    paddingTop: SPACING.MEDIUM,
    marginTop: SPACING.MEDIUM,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    gap: SPACING.MEDIUM,
  },
  modalButton: {
    flex: 1,
    height: 52,
    borderRadius: SPACING.LARGE,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cancelButton: {
    backgroundColor: COLORS.mediumGrey + '40',
  },
  modalButtonText: {
    fontSize: FONT_SIZES.MEDIUM,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  cancelButtonText: {
    color: COLORS.grey,
  },
  addTaskButton: {
    backgroundColor: COLORS.primary,
  },
  modalButtonGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SPACING.LARGE,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  addTaskButtonText: {
    color: COLORS.white,
  },
});

export default PlannerScreen;