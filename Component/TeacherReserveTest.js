import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button, Image, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';

const windowWidth = Dimensions.get('window').width;

const teacherData = [
  { id: '1', name: '원빈', subject: '스키', image: require('../Images/face.jpg') },
  { id: '2', name: '주성', subject: '보드', image: require('../Images/face1.jpg') },
  { id: '3', name: '정훈', subject: '스키+보드', image: require('../Images/face2.jpg') },
 
];

function TeacherReserveTestScreen() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [isTimeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);

  const handleTeacherPress = (teacher) => {
    setSelectedTeacher(teacher);
    setCalendarModalVisible(true);
  };

  const handleDatePress = (date) => {
    setSelectedDate(date.dateString);
    setAvailableTimes(generateAvailableTimes());
    setCalendarModalVisible(false); 
    setTimeModalVisible(true); 
  };

  const handleTimeConfirm = (time) => {
    // 선택한 시간을 처리하는 로직을 추가
    // 예: 예약을 저장하거나 다른 작업을 수행
    setTimeModalVisible(false); 
  };

  const closeModal = () => {
    setCalendarModalVisible(false); 
    setTimeModalVisible(false); 
    setSelectedTeacher(null);
    setSelectedDate(null);
    setAvailableTimes([]);
  };

  // 가상의 시간 목록 생성 (9:00부터 20:30까지 1시간 간격)
  const generateAvailableTimes = () => {
    const times = [];
    let hour = 9;

    while (hour < 21) {
      times.push(`${hour.toString().padStart(2, '0')}:00`);
      hour += 1;
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
              <View style={styles.teacherInfo}>
                <Image source={item.image} style={styles.teacherImage} />
                <View>
                  <Text style={styles.teacherName}>{item.name}</Text>
                  <Text style={styles.teacherSubject}>{item.subject}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          style={styles.teacherList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Modal
        visible={isCalendarModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{selectedTeacher?.name} 강사님</Text>
          <Calendar
            onDayPress={(day) => handleDatePress(day)}
            style={{
              width: windowWidth * 0.9,
              marginTop: 20,
            }}
          />
          <Button title="닫기" onPress={closeModal} />
        </View>
      </Modal>

      <Modal
        visible={isTimeModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{selectedTeacher?.name} 강사님</Text>
          {selectedDate && (
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
    marginLeft: 1,
    marginTop: 5,
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
    backgroundColor: 'skyblue',
    padding: 10,
    margin: 5, // 간격 조절
    borderRadius: 5,
    width: 100, // 버튼 너비 조절
    alignItems: 'center', // 수평 정렬
  },
  timeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherImage: {
    width: 50, // Adjust the width as needed
    height: 50, // Adjust the height as needed
    borderRadius: 25, // Make it circular by setting borderRadius to half of width/height
    marginRight: 10, // Add some space between the image and text
  },
});

export default TeacherReserveTestScreen;



