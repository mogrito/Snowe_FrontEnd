import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Image, Dimensions, Button, Alert} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useIsFocused,useNavigation } from '@react-navigation/native';

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
  const navigation =useNavigation();

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
    if (teacher.count >= 50) {
      // 선택된 강사의 인원수가 50명 이상인 경우 알림창을 표시.
      Alert.alert(
        "수강인원이 꽉찼습니다",
        "더 이상 신청이 불가능합니다.",
        [
          {
            text: "확인",
          }
        ]
      );
    } else {
      setSelectedTeacher(teacher);
      setModalVisible(true);
      
    }
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

  const goAlert = () => {
    Alert.alert(
      "신청완료",
      "신청이 완료되었습니다",
      [
        {
          text: "OK",

        }
       
      ]
      
    );
  }
  

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
      <Modal animationType="slide" visible={modalVisible} presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <Text style={styles.reservationTitle}>예약 확인</Text>
          <Image source={selectedTeacher?.image} style={styles.teacherModalImage} />
          <Text style={styles.teacherModalName}>{`${selectedTeacher?.name} 강사님`}</Text>
          <Text style={styles.selectedDate}>{`강습 시작일: ${selectedDate}`}</Text>
          <Text style={styles.selectedTime}>{`강습 시작시간: ${selectedTeacher?.edudate}`}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.checkReserveButton} onPress={() => {
              handleModalButtonPress();
              goAlert();
            }}>
              <Text style={styles.buttonText}>신청</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => {
              setModalVisible(false); // Close the modal
            }}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  
  teacherModalImage: {
    width: 200,
    height: 200,
    borderRadius: 200,
    marginTop: 10,
    marginBottom: 20, 
  },
  teacherModalName: {
    fontSize: 30,
    marginBottom: 40, 
    fontWeight: 'bold',
  },
  selectedDate: {
    marginBottom: 10, 
    fontSize: 20
  },
  selectedTime: {
    marginBottom: 20,
    fontSize: 20 
  },
  reservationTitle: {
    position: 'absolute',
    top: 30, 
    left: 10, 
    fontSize: 30,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 10,
  },
  cancelButton: {
    width: '30%',
    height: 40,
    left:10,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 

  },
  checkReserveButton: {
    width: '30%',
    height: 40,
    right:10,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20, 
  },
  buttonText: {
    fontWeight:'bold'
  }
});

export default TeacherReserveTestScreen;





