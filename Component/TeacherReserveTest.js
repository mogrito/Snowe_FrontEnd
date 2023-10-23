import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useIsFocused } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;

const TeacherReserveTestScreen = () => {
  const isFocused = useIsFocused();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [teacherData, setTeacherData] = useState([
    { id: '1', name: '원빈', subject: '스키초급반', image: require('../Images/face.jpg'), count: 0, edudate: '09:00' },
    { id: '2', name: '주성', subject: '보드초급반', image: require('../Images/face1.jpg'), count: 0, edudate: '17:00' },
    { id: '3', name: '정훈', subject: '스키초급반', image: require('../Images/face2.jpg'), count: 0, edudate: '11:00' },
  ]);

  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    const filteredTeachers = teacherData.filter((teacher) => teacher.edudate === date.dateString);
    setFilteredTeachers(filteredTeachers);
  };

  const resetTeacherList = () => {
    setFilteredTeachers([]);
    setSelectedTeacher(null);
    setSelectedDate(null);
  };

  useEffect(() => {
    if (isFocused) {
      // 화면이 활성화되면 강사 리스트를 초기화
      resetTeacherList();
    }
  }, [isFocused]);

  const sortedTeacherData = teacherData.slice().sort((a, b) => {
    const timeA = parseInt(a.edudate.replace(':', ''));
    const timeB = parseInt(b.edudate.replace(':', ''));
    return timeA - timeB;
  });

  const lastTeacherItemStyle = {
    teacherItem: {
      marginBottom: 0, 
    },
  };

  const handleTeacherPress = (teacher) => {
    setSelectedTeacher(teacher);
    setModalVisible(true);
    // 여기에 선택한 강사에 대한 추가 동작
  };

  const handleModalButtonPress = () => {
    // 선택한 선생님의 count를 증가시킵니다.
    if (selectedTeacher) {
      const updatedTeacherData = teacherData.map((teacher) =>
        teacher.id === selectedTeacher.id
          ? { ...teacher, count: teacher.count + 1 }
          : teacher
      );
      setTeacherData(updatedTeacherData);
    }
    setModalVisible(false); // 모달을 닫습니다.
  };

  useEffect(() => {
    if (isFocused) {
      resetTeacherList();
    }
  }, [isFocused]);


  return (
    <View style={styles.container}>
      <View style={styles.teacherWrapper}>
        <Text style={styles.title}>강사 예약</Text>
        <Calendar
          style={styles.calender}
          onDayPress={handleDateSelect}
        />
        {selectedDate && (
          <FlatList
            data={sortedTeacherData}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[
                  styles.teacherItem,
                  index === filteredTeachers.length - 1 ? lastTeacherItemStyle.teacherItem : null
                ]}
                onPress={() => handleTeacherPress(item)}
              >
                <View style={styles.teacherInfo}>
                  <Image source={item.image} style={styles.teacherImage} />
                  <View>
                    <Text style={styles.teacherName}>{item.name}</Text>
                    <Text style={styles.eduTime}>{item.edudate}</Text>
                  </View>
                  <Text style={styles.teacherCount}>{`(${item.count} / 50)`}</Text>
                  <Text style={styles.teacherSubject}>{item.subject}</Text>
                </View>
              </TouchableOpacity>
            )}
            style={styles.teacherList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text>선생님 선택: {selectedTeacher?.name}</Text>
          <Button title="신청하기" onPress={handleModalButtonPress} />
        </View>
      </Modal>
    </View>
  );
};

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
    fontSize: 20,
    color: 'black',
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
    margin: 5,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
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
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  teacherCount: {
    left: 210,
  },
  eduTime: {
    right: 0,
    marginTop: 5,
  },
  calender: {
    marginTop: 30,
    borderRadius: 10,
  },
});

export default TeacherReserveTestScreen;





