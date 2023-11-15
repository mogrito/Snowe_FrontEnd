import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
} from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getTokenFromLocal } from './TokenUtils';
import axios from 'axios';

const Tab = createMaterialTopTabNavigator();

const TeacherLessonListScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [teacherlessondata, setTeacherlessondataData] = useState([]); //강사 강습 데이터 
  const [studentData, setStudentData] = useState([]);     // 강습을 등록한 회원 데이터
  const [studentModalVisible, setStudentModalVisible] = useState(false);  // 회원정보 모달


  //강습 데이터 들고오기 
  useEffect(() => {
    const fetchData = async () => {
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;
      try {
        const response = await axios.get('http://192.168.25.204:8080/teachers/lessonList', {
          headers: {
            'Authorization': authorizationHeader,
          },
        });
    
        const responseData = response.data;
        setTeacherlessondataData(responseData);      
    
      } catch (error) {
        // 오류 처리
        console.error('API 요청 중 오류 발생:', error);
      }
    };
    fetchData();
  }, []);


    // 회원정보 버튼을 누르면 
    const showMemberByLesson = async (lessonId) => {
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;

      try {
        // 강습별 회원정보를 가져옴
        const response = await axios.get(`http://192.168.25.204:8080/teachers/student-List?lessonId=${lessonId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authorizationHeader,
          },
        });

        const responseData = response.data
        setStudentData(responseData);
  
      } catch (error) {
        console.error('회원정보 불러오는중 오류 발생:', error);
      }
    };
  
    const onMember = (lessonId) => {
      // 강사 ID가 예약 데이터에 있는 것
      showMemberByLesson(lessonId);
    };



  const onGoBack = () => {
    navigation.pop();
  };

  const currentDate = new Date();

  const currentDateFormatted = currentDate.toISOString().split('T')[0];
  console.log(currentDateFormatted);
  console.log(teacherlessondata);

  const beforeLessons = teacherlessondata.filter((item) => item.lessonDate > currentDateFormatted);
  const duringLessons = teacherlessondata.filter((item) => item.lessonDate <= currentDateFormatted && currentDateFormatted <= item.lessonDateEnd);
  const afterLessons = teacherlessondata.filter((item) => item.lessonDateEnd < currentDateFormatted);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.buttonContainer}>
          <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
        </View>
        <Text style={styles.title}>내 강습 목록</Text>
      </View>

      <Tab.Navigator>
        <Tab.Screen name="강습 전">
          {() => (
            <FlatList
              style={{ backgroundColor: '#DBEBF9' }}
              data={beforeLessons}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemContent}>

                    <View style={styles.textContainer}>
                    <Text style={styles.itemText}>"{item.lessonTitle}"</Text>
   
                    </View>
                    <View style={styles.textContainer1}>
                    <Text style={styles.itemText1}>({item.reserveCount}/{item.maxReserveCount})</Text>
                    </View>

                    <TouchableOpacity
                      style={styles.moreinfoButton}
                      onPress={() => {
                        setSelectedReservation(item);
                        setModalVisible(true);
                      }}>
                      <Text style={styles.moreinfoButtonText}>상세보기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.moreinfoButton1}
                      onPress={() => {
                        showMemberByLesson(item.lessonId);
                        setStudentModalVisible(true);
                      }}>
                        <Text style={styles.moreinfoButtonText}>회원정보</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="강습 중">
          {() => (
            <FlatList
              style={{ backgroundColor: '#DBEBF9' }}
              data={duringLessons}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemContent}>

                    <View style={styles.textContainer}>
                    <Text style={styles.itemText}>"{item.lessonTitle}"</Text>
               
                    </View>

                    {/* <View style={styles.textContainer}>

                    </View> */}

                    <View style={styles.textContainer1}>
                    <Text style={styles.itemText1}>({item.reserveCount}/{item.maxReserveCount})</Text>
                    </View>


                    <TouchableOpacity
                      style={styles.moreinfoButton}
                      onPress={() => {
                        setSelectedReservation(item);
                        setModalVisible(true);
                      }}
                    >
                      <Text style={styles.moreinfoButtonText}>상세보기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.moreinfoButton1}
                      onPress={() => {
                        showMemberByLesson(item.lessonId);
                        setStudentModalVisible(true);
                      }}>
                        <Text style={styles.moreinfoButtonText}>회원정보</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="강습 후">
          {() => (
            <FlatList
              style={{ backgroundColor: '#DBEBF9' }}
              data={afterLessons}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemContent}>


                    <View style={styles.textContainer}>
                    <Text style={styles.itemText}>"{item.lessonTitle}"</Text>
                    </View>

                    {/* <View style={styles.textContainer}>
                    </View> */}

                    <View style={styles.textContainer1}>
                    <Text style={styles.itemText1}>({item.reserveCount}/{item.maxReserveCount})</Text>
                    </View>

                    
                    <TouchableOpacity
                      style={styles.moreinfoButton}
                      onPress={() => {
                        setSelectedReservation(item);
                        setModalVisible(true);
                      }}
                    >
                      <Text style={styles.moreinfoButtonText}>상세보기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.moreinfoButton1}
                      onPress={() => {
                        showMemberByLesson(item.lessonId);
                        setStudentModalVisible(true);
                      }}>
                        <Text style={styles.moreinfoButtonText}>회원정보</Text>
                    </TouchableOpacity>

                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalContent}>
              
              {/* <Image source={selectedReservation?.image} style={styles.modalImage} /> */}
              <Text style={styles.modalText1}>{selectedReservation?.lessonTitle}</Text>
              <Text style={styles.modalText}>{`한줄소개 : ${selectedReservation?.lessonIntroduce}`}</Text>
              <Text style={styles.modalText}>{`강습 장소 : ${selectedReservation?.resortId} `}</Text>
              <Text style={styles.modalText}>{`장비/레벨 : ${selectedReservation?.lessonClass} / ${selectedReservation?.lessonLevel}`}</Text>
              <Text style={styles.modalText}>{`강습 시작일 : ${selectedReservation?.lessonDate}`}</Text>
              <Text style={styles.modalText}>{`강습 종료일 : ${selectedReservation?.lessonDateEnd}`}</Text>
              <Text style={styles.modalText}>{`강습 시작시간 : ${selectedReservation?.lessonStart}`}</Text>
              <Text style={styles.modalText}>{`강습 종료시간 : ${selectedReservation?.lessonEnd}`}</Text>
              <Text style={styles.modalText}>{`강습타임 : ${selectedReservation?.lessonDiv}`}</Text>
              <Text style={styles.modalText}>{`강습연령 : ${selectedReservation?.lessonAge}`}</Text>
              <Text style={styles.modalText}>{`신청인원 : ${selectedReservation?.reserveCount}`}</Text>

              <TouchableOpacity style={styles.cancelButton1} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseButton}>닫기</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </View>
      </Modal>

      <Modal visible={studentModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalContent}>

              <FlatList
                data={studentData}
                keyExtractor={(item) => item.studentId.toString()}
                renderItem={({ item }) => (

                  <TouchableOpacity
                    style={styles.studentItem}
                  >

                    <Text style={styles.modalText}>이름 : {item.name}</Text>
                    <Text style={styles.modalText}>이메일 : {item.email}</Text>
                    <Text style={styles.modalText}>닉네임: {item.nickName}</Text>

                  </TouchableOpacity>
                )}/>
              <TouchableOpacity style={styles.cancelButton1} onPress={() => setStudentModalVisible(false)}>
                <Text style={styles.modalCloseButton}>닫기</Text>
              </TouchableOpacity>

            </View>
          </ScrollView>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9',
    paddingHorizontal: 0,
    paddingTop: 60,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 30,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    marginRight: 1,
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  textContainer1: {
    marginRight:35,
  },
  
  itemText: {
    fontSize: 15,
    marginBottom: 0,
    fontWeight: 'bold',
    width:"230%",
   
  },
  itemText1: {
    fontSize: 16,


  },
  moreinfoButton: {
    width: '18%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:10,
   
  },
  moreinfoButton1: {
    width: '18%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight : 1,
  },
  moreinfoButtonText: {
    textAlign: 'center',
  },
  cancelButton: {
    width: '15%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: 300,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center', // 중앙 정렬을 위해 추가
    marginTop: 290,
  },
  modalImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  modalText: {
    fontSize: 16,
    marginTop: 10,
  },
  modalText1: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  modalCloseButton: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginTop: 2,
  },
  cancelButton1: {
    width: '25%',
    height: 40,
    padding: 0,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  // 회원정보 모달 구분
  studentItem: {
    padding: 10, // 각 학생 아이템의 안쪽 여백
    marginBottom: 10, // 각 학생 아이템 간의 아래 여백
  },
});

export default TeacherLessonListScreen;
