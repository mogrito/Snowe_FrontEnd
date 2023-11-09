import React, { useState } from 'react';
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

const data = [
  {
    id: '1',
    name: '원빈',
    introduce: '강해지고 싶나?',
    image: require('../Images/face.jpg'),
    count: 0,
    edustartdate: '2023-11-09',
    eduenddate: '2023-12-01',
    edustarttime:'10:00',
    subject: '스키',
    level: 'LV1',
    yak: [
      '- T&D(Technical & Different) HEAD COACH',
      '- (전) 알파인 스키선수 (2007~2014)',
      '- 건국대학교 생활체육학과 졸업',
      '- 생활체육지도자 2급',
    ],
    carrer: [
      '- KSIA 대한스키지도자연맹 전국기술선수권대회 종합 14위',
      '- SBAK 한국스키장경영협회 전국기술선수권대회 종합 13위',
      '- 대명비발디파크 카브배 기술선수권대회 종합 5위',
      '- 한솔섬유배 인터스키대회 전주자',
    ],
    team: ['- T&D SKI ', '- BHS', '- POC ', '- LEKI'],
    
  },
  { 
    id: '2', 
    name: '주성', 
    introduce: '찾아라 원피스', 
    image: require('../Images/face1.jpg'), 
    count: 0, 
    edustartdate: '2023-09-07', 
    eduenddate: '2023-10-07', 
    edustarttime:'12:00',
    subject: '보드', 
    level: 'LV2',
    yak: [
      '- T&D(Technical & Different)SKI PROGRAM DIRECTOR',
      '- SBAK 한국스키장경영협회 데몬스트레이터 3기 인정 (2018~2025)',
      '- KSEA 대한스키교육협회 교육위원장',
      '- KSIA 대한스키지도자연맹 데몬스트레이터 4기 인정 (2013~2017)',
    ],
    carrer: [
      '- 제 8회 SBAK 한국스키장경영협회 전국기술선수권대회 종합 3위 ',
      '- 제 4기 SBAK 한국스키장경영협회 데몬스트레이터 선발',
      '- KSEA 대한스키교육협회 교육위원장 임명',
      '- 한솔섬유배 인터스키대회 전주자',
    ],
    team: [
      '- WONYANG 후원',
      '- 한방유비스 후원',
      '- OGASAKA SKI(오가사카) ',
      '- REXXAM BOOTS(렉삼) '
    ]
  },
  { 
    id: '3', 
    name: '정훈', 
    introduce: '아이스 에이지..', 
    image: require('../Images/face2.jpg'), 
    count: 0, 
    edustartdate: '2024-11-07',
    eduenddate: '2024-12-04', 
    edustarttime:'15:00',
    subject: '스키', 
    level: 'LV3',
    yak: [
      'T&D(Technical & Different)  COACH',
      '- (전) 알파인 스키선수 (2007~2014)',
      '- 용인대학교 체육학과 졸업',
      '- 스키 경력 (12년)'
    ],
    carrer: [
      '- 한솔섬유배 인터스키대회 출전',
      '- 지산배 한국오픈스키 챔피언십 출전',
      '- SBAK 한국스키장경영협회 전국기술선수권대회 출전',
      '- 뉴질랜드 하계 스키캠프 참여',
    ],
    team: [
      '- T&D SKI ',
    ] 
  },
];

const ReservationListScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const onGoBack = () => {
    navigation.pop();
  };

  const currentDate = new Date();
  const beforeLessons = data.filter((item) => new Date(item.edustartdate) > currentDate);
  const duringLessons = data.filter(
    (item) => new Date(item.edustartdate) <= currentDate && currentDate <= new Date(item.eduenddate)
  );
  const afterLessons = data.filter((item) => new Date(item.edustartdate) > currentDate);

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
              <TouchableOpacity style={styles.cancelButton1} onPress={() => setModalVisible(false) }>
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
    width:300,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center', // 중앙 정렬을 위해 추가
    marginTop:290,
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
    fontWeight:'bold',
  },
  modalCloseButton: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginTop: 2,
  },
  cancelButton1: {
    width: '25%',
    height:40,
    padding:0,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ReservationListScreen;
