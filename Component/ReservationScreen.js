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
  Alert,
  TextInput
} from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import { useNavigation } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getTokenFromLocal } from './TokenUtils';
import axios from 'axios';
import { checkTokenAndNavigate } from './TokenUtils';

const Tab = createMaterialTopTabNavigator();
const URL = 'http://192.168.25.202:8080';
const ReservationScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservatedata, setReservatedataData] = useState([]); //예약 데이터 
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState('');

  checkTokenAndNavigate();


  //예약 데이터 들고오기 
  useEffect(() => {
    const fetchData = async () => {
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;
      try {
        const response = await axios.get('http://192.168.25.204:8080/reservation/reserveList', {
          headers: {
            'Authorization': authorizationHeader,
          },
        });
    
        const responseData = response.data;
        setReservatedataData(responseData);
        console.log('여깁니다@@@@@@@@', responseData);

      } catch (error) {
        // 오류 처리
        console.error('API 요청 중 오류 발생:', error);
      }
    };
    fetchData();
  }, []);


  //취소버튼을 누르면 item.id, item.teacherId 를 onCancel로 보내고 cancelReservation에 값을 전달하고 cancelReservation를 통해 DB로 보냄

  const cancelReservation = async (reserveId) => {
    const token = await getTokenFromLocal();
    const authorizationHeader = `Bearer ${token}`;

    try {
      // 서버에 예약 취소를 요청합니다.
      const response = await fetch(`http://192.168.25.202:8080/reservation/reserveCancel?reserveId=${reserveId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader,
        },
      });

      if (response.ok) {
        Alert.alert('알림', '취소가 완료되었습니다!', [
          {
            text: '확인',
            onPress: () => {
              // 취소가 성공하면 상태를 업데이트하여 취소된 예약을 제거합니다.
              console.log('Before update:', reservatedata);
              setReservatedataData((prevData) => prevData.filter(item => item.reserveId !== reserveId));
              console.log('After update:', reservatedata);

            },
          },
        ]);
      } else {
        console.error('예약 취소 중 오류 발생');
      }
    } catch (error) {
      console.error('예약 취소 중 오류 발생:', error);
    }
  };

  const onCancel = (reserveId) => {
    // 강사 ID가 예약 데이터에 있는 것
    cancelReservation(reserveId);
  };

  const onGoBack = () => {
    navigation.pop();
  };

  const goReview = (lessonId, teacherId) => {
    setSelectedReservation({ lessonId, teacherId }); // 리뷰 작성에 필요한 정보 설정
    setModalVisible(true);
  };

  const reviewCloseModal = () => {
    setModalVisible(false);
};

const submitReview = async () => {
  try {
    const token = await getTokenFromLocal();
    const authorizationHeader = `Bearer ${token}`;

    const response = await fetch(`${URL}/review/addReview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authorizationHeader,
      },
      body: JSON.stringify({
        lessonId:selectedReservation?.lessonId,
        teacherId:selectedReservation?.teacherId,
        review:review,
      }),
    });

    if (response.ok) {
      alert('리뷰 제출 성공');
      setModalVisible(false);
    } else {
      alert('리뷰 제출 실패');
    }
  } catch (error) {
    console.error('리뷰 제출 중 오류 발생:', error);
  }
};

  const currentDate = new Date();
  console.log(currentDate);
  const currentDateFormatted = currentDate.toISOString().split('T')[0];
  console.log(currentDateFormatted);
  console.log(reservatedata);
  const beforeLessons = reservatedata.filter((item) => item.lessonDate > currentDateFormatted);
  const duringLessons = reservatedata.filter((item) => item.lessonDate <= currentDateFormatted && currentDateFormatted <= item.lessonDateEnd);
  const afterLessons = reservatedata.filter((item) => item.lessonDateEnd < currentDateFormatted);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.buttonContainer}>
          <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
        </View>
        <Text style={styles.title}>예약 목록</Text>
      </View>

      <Tab.Navigator>
        <Tab.Screen name="수강 전">
          {() => (
            <FlatList
              style={{ backgroundColor: '#DBEBF9' }}
              data={beforeLessons}
              keyExtractor={(item) => item.reserveId.toString()}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemContent}>
                    <View style={styles.imageContainer}>
                      <Image source={item.image} style={styles.teacherImage} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.itemText}>{item.name} 강사님</Text>
                      <Text style={styles.itemText1}>{item.lessonTitle}</Text>
                    </View>
                    <View style={styles.buttonView}>
                      <TouchableOpacity
                        style={styles.moreinfoButton}
                        onPress={() => {
                          setSelectedReservation(item);
                          setIsModalVisible(true);
                        }}
                      >
                        <Text style={styles.moreinfoButtonText}>상세보기</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onCancel(item.reserveId)} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>취소</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="수강 중">
          {() => (
            <FlatList
              style={{ backgroundColor: '#DBEBF9' }}
              data={duringLessons}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemContent}>
                    <View style={styles.imageContainer}>
                      <Image source={item.image} style={styles.teacherImage} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.itemText}>{item.name} 강사님</Text>
                      <Text style={styles.itemText1}>{item.lessonTitle}</Text>
                    </View>
                    <View style={styles.buttonView}>
                      <TouchableOpacity
                        style={styles.moreinfoButton}
                        onPress={() => {
                          setSelectedReservation(item);
                          setIsModalVisible(true);
                        }}
                      >
                        <Text style={styles.moreinfoButtonText}>상세보기</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => onCancel(item.reserveId, item.teacherId)} style={styles.reviewButton}>
                        <Text style={styles.cancelButtonText}>취소</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="수강 후">
          {() => (
            <FlatList
              style={{ backgroundColor: '#DBEBF9' }}
              data={afterLessons}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemContent}>
                    <View style={styles.imageContainer}>
                      <Image source={item.image} style={styles.teacherImage} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.itemText}>{item.name} 강사님</Text>
                      <Text style={styles.itemText1}>{item.lessonTitle}</Text>
                    </View>
                    <View style={styles.buttonView}>
                      <TouchableOpacity
                        style={styles.moreinfoButton}
                        onPress={() => {
                          setSelectedReservation(item);
                          setIsModalVisible(true);
                        }}
                      >
                        <Text style={styles.moreinfoButtonText}>상세보기</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.reviewButton} onPress={() => goReview(item.lessonId, item.teacherId)}>
                        <Text style={styles.goReviewButton}>리뷰 남기기</Text>
                      </TouchableOpacity>
                    </View>
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
              <Image source={selectedReservation?.image} style={styles.modalImage} />
              <Text style={styles.modalText1}>{selectedReservation?.name}</Text>
              <Text style={styles.modalText}>{`강습 장소: ${selectedReservation?.resortId}`}</Text>
              <Text style={styles.modalText}>{`강습명: ${selectedReservation?.lessonTitle}`}</Text>
              <Text style={styles.modalText}>{`강습 시작일: ${selectedReservation?.lessonDate}`}</Text>
              <Text style={styles.modalText}>{`강습 시작 시간: ${selectedReservation?.lessonStart}`}</Text>
              <View style={styles.cancelButtonView}>
                <TouchableOpacity style={styles.cancelButton1} onPress={() => setIsModalVisible(false)}>
                  <Text style={styles.modalCloseButton}>닫기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
      {/* 리뷰 모달 */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.reviewModalContent}>
            <Text style={styles.reviewTitle}>강의 리뷰 작성</Text>
            <TextInput
              style={styles.reviewCommentInput}
              placeholder="리뷰를 작성해주세요."
              multiline
              value={review}
              onChangeText={(text) => setReview(text)}
            />
            <View style={styles.reviewModalButtonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
                <Text style={styles.submitButtonText}>리뷰 제출</Text>
              </TouchableOpacity>

              {/* 모달 닫기 버튼 */}
              <TouchableOpacity style={styles.closeButton} onPress={reviewCloseModal}>
                <Text style={styles.closeButtonText}>닫기</Text>
              </TouchableOpacity>
            </View>
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
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
  itemContent: {
    width:'100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width:'15%',
    borderRadius: 50,
    overflow: 'hidden',
  },
  teacherImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    width:'50%'
  },
  buttonView:{
    width:'35%',
    flexDirection:'row',
    justifyContent:'space-between',
    paddingBottom:10
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  itemText1: {
    fontSize: 16,
    marginTop: 5,
  },
  moreinfoButton: {
    width: '45%',
    height: 40,
    padding: 0,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginLeft:10
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
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
    marginTop: 2,
  },
  goReviewButton: {
    fontSize: 11,
    color: 'black',
    textAlign: 'center',
    marginTop: 2,
  },
  cancelButton1: {
    width: '100%',
    height: 40,
    padding: 0,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  reviewButton: {
    width: '45%',
    height: 40,
    padding: 0,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonView:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  reviewModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  reviewModalContent: {
    backgroundColor: 'white',
    width: 300,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center', // 중앙 정렬을 위해 추가
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  reviewCommentInput: {
    width:'100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  submitButton: {
    width:'35%',
    backgroundColor: 'skyblue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    width:'35%',
    backgroundColor: 'red',
    borderRadius: 8,
    alignItems: 'center',
    padding: 12,
    marginBottom: 16,
    marginLeft:10
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  reviewModalButtonContainer:{
    width:'100%',
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    marginRight:10
  }
});

export default ReservationScreen;
