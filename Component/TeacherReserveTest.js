import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const teacherData = [
  { id: '1', name: 'Teacher 1', subject: 'Math' },
  { id: '2', name: 'Teacher 2', subject: 'Science' },
  { id: '3', name: 'Teacher 3', subject: 'History' },
  // 추가 강사 데이터를 필요에 따라 추가하세요.
];

function TeacherReserveTestScreen() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);

  const handleTeacherPress = (teacher) => {
    setSelectedTeacher(teacher);
    setModalVisible(true);
  };

  const handleDatePress = (date) => {
    setSelectedDate(date.dateString);
    setAvailableTimes(generateAvailableTimes());
    setTimePickerVisible(true);
  };

  const handleTimeConfirm = (time) => {
    // 선택한 시간을 처리하는 로직을 추가하세요.
    // 예: 예약을 저장하거나 다른 작업을 수행합니다.
    setTimePickerVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTeacher(null);
    setSelectedDate(null);
    setAvailableTimes([]);
  };

  // 가상의 시간 목록 생성 (9:00부터 21:00까지 30분 간격)
  const generateAvailableTimes = () => {
    const times = [];
    let hour = 9;
    let minute = 0;

    while (hour <= 21) {
      times.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      minute += 30;
      if (minute === 60) {
        hour += 1;
        minute = 0;
      }
    }

    return times;
  };

  return (
    <View style={styles.container}>
      <View style={styles.teacherWrapper}>
        <Text style={styles.title}>강사 예약</Text>
        <FlatList
          data={teacherData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.teacherItem}
              onPress={() => handleTeacherPress(item)}
            >
              <Text style={styles.teacherName}>{item.name}</Text>
              <Text style={styles.teacherSubject}>{item.subject}</Text>
            </TouchableOpacity>
          )}
          style={styles.teacherList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{selectedTeacher?.name} 강사님</Text>
          <Calendar
            onDayPress={(day) => handleDatePress(day)}
            // 달력 구성 및 속성 설정
            // 예: markedDates, onDayPress 등
          />

          {availableTimes.length > 0 && (
            <View style={styles.timeButtonsContainer}>
              {availableTimes.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.timeButton}
                  onPress={() => handleTimeConfirm(time)}
                >
                  <Text style={styles.timeButtonText}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <Button title="닫기" onPress={closeModal} />

          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleTimeConfirm}
            onCancel={() => setTimePickerVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5FB',
  },
  teacherWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  teacherItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
  },
  teacherName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teacherSubject: {
    fontSize: 16,
    color: 'gray',
  },
  teacherList: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  timeButtonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  timeButton: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TeacherReserveTestScreen;


