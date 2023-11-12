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

const Tab = createMaterialTopTabNavigator();

const ReservationListScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservatedata, setReservatedataData] = useState([]); //예약 데이터 


  //예약 데이터 들고오기 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('your-api-endpoint');
        const result = await response.json();
        setReservatedataData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  //취소버튼을 누르면 item.id, item.teacherId 를 onCancel로 보내고 cancelReservation에 값을 전달하고 cancelReservation를 통해 DB로 보냄
  
  const cancelReservation = async (reservationId, teacherId) => {
    try {
      // 서버에 예약 취소를 요청합니다.
      const response = await fetch('취소 API 엔드포인트', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId,
          teacherId,
        }),
      });

      if (response.ok) {
        // 취소가 성공하면 상태를 업데이트하여 취소된 예약을 제거합니다.
        setReservatedataData((prevData) => prevData.filter(item => item.id !== reservationId));
      } else {
        console.error('예약 취소 중 오류 발생');
      }
    } catch (error) {
      console.error('예약 취소 중 오류 발생:', error);
    }
  };

  const onCancel = (reservationId, teacherId) => {
    // 강사 ID가 예약 데이터에 있는 것
    cancelReservation(reservationId, teacherId);
  };

  const onGoBack = () => {
    navigation.pop();
  };

  const currentDate = new Date();
  const beforeLessons = reservatedata.filter((item) => new Date(item.edustartdate) > currentDate);
  const duringLessons = reservatedata.filter(
    (item) => new Date(reservatedata.edustartdate) <= currentDate && currentDate <= new Date(item.eduenddate)
  );
  const afterLessons = reservatedata.filter((item) => new Date(item.edustartdate) > currentDate);

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
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemContent}>
                    <View style={styles.imageContainer}>
                      <Image source={item.image} style={styles.teacherImage} />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={styles.itemText}>{item.name}</Text>
                      <Text style={styles.itemText1}>{item.introduce}</Text>
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
                    <TouchableOpacity onPress={() => onCancel(item.id, item.teacherId)} style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>취소</Text>
                    </TouchableOpacity>
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
                      <Text style={styles.itemText}>{item.name}</Text>
                      <Text style={styles.itemText1}>{item.introduce}</Text>
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
                    <TouchableOpacity onPress={() => onCancel(item.id, item.teacherId)} style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>취소</Text>
                    </TouchableOpacity>
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
                      <Text style={styles.itemText}>{item.name}</Text>
                      <Text style={styles.itemText1}>{item.introduce}</Text>
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
                    <TouchableOpacity onPress={() => onCancel(item.id)} style={styles.cancelButton}>
                      <Text style={styles.cancelButtonText}>취소</Text>
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
              <Image source={selectedReservation?.image} style={styles.modalImage} />
              <Text style={styles.modalText1}>{selectedReservation?.name}</Text>
              <Text style={styles.modalText}>{`강습 장소: 선택된 리조트 `}</Text>
              <Text style={styles.modalText}>{`강습명: ${selectedReservation?.introduce}`}</Text>
              <Text style={styles.modalText}>{`강습 시작일: ${selectedReservation?.edustartdate}`}</Text>
              <Text style={styles.modalText}>{`강습 시간: ${selectedReservation?.edustarttime}`}</Text>
              <TouchableOpacity style={styles.cancelButton1} onPress={() => setModalVisible(false)}>
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
    width: '20%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
});

export default ReservationListScreen;
