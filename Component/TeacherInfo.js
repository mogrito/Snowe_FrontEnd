import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, ScrollView,} from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

//yak = 약력 carrer = 경력 team = 소속 

const data = [
  {
    id: '1',
    name: '원빈',
    introduce: '강해지고 싶나?',
    image: require('../Images/face.jpg'),
    count: 0,
    edudate: '09:00',
    subject: '스키',
    level: 'LV1',
    yak: [
      '- T&D(Technical & Different) HEAD COACH',
      '- (전) 알파인 스키선수 (2007~2014)',
      '- 건국대학교 생활체육학과 졸업',
      '- 생활체육지도자 2급'
    ],
    carrer: [
      '- KSIA 대한스키지도자연맹 전국기술선수권대회 종합 14위',
      '- SBAK 한국스키장경영협회 전국기술선수권대회 종합 13위',
      '- 대명비발디파크 카브배 기술선수권대회 종합 5위',
      '- 한솔섬유배 인터스키대회 전주자'
    ],
    team: [
      '- T&D SKI ',
      '- BHS',
      '- POC ',
      '- LEKI'
    ]
  }, 
  
  { id: '2', name: '주성', introduce: '찾아라 원피스', image: require('../Images/face1.jpg'), count: 0, edudate: '17:00', subject: '보드', level: 'LV2' ,
  yak: [
    '- T&D(Technical & Different)SKI PROGRAM DIRECTOR',
    '- (현)SBAK 한국스키장경영협회 데몬스트레이터 3기 인정(2018~2025)',
    '- (현)KSEA 대한스키교육협회 교육위원장',
    '- (전)KSIA 대한스키지도자연맹 데몬스트레이터 4기 인정(2013~2017)'
  ],
  carrer: [
    '- 제 8회 SBAK 한국스키장경영협회 전국기술선수권대회 종합 3위 ',
    '- 제 4기 SBAK 한국스키장경영협회 데몬스트레이터 선발 (임기: 2023~2025)',
    'KSEA 대한스키교육협회 교육위원장 임명',
    '한솔섬유배 인터스키대회 전주자(With 김소진 HEAD COACH)'
  ],
  team: [
    '- WONYANG 후원',
    '- 한방유비스 후원',
    '- OGASAKA SKI(오가사카) ',
    '- REXXAM BOOTS(렉삼) '
  ]},



  { id: '3', name: '정훈', introduce: '아이스 에이지..', image: require('../Images/face2.jpg'), count: 0, edudate: '11:00', subject: '스키', level: 'LV3',
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
    '- 뉴질랜드 하계 스키캠프 참여'
  ],
  team: [
    '- T&D SKI ',
  ] },
];


const levelColors = {
  LV1: 'lightgreen',
  LV2: 'lightblue',
  LV3: 'lightpink',
};

const eachsubject = {
  스키: require('../Images/ski.png'),
  보드: require('../Images/skiboard.png'),
};


const TeacherInfoScreen = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const navigation = useNavigation();

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await fetch(`http://localhost:8080/member/getTeacherList?ridingClass=${selectedCategory}`);
  //       if (!response.ok) {
  //         throw Error('서버에서 데이터를 가져오지 못했습니다.');
  //       }
  //       const data = await response.json();
  //       setTeachers(data);
  //       console.log(data);
  //     } catch (error) {
  //       console.error('데이터 가져오기 중 오류 발생:', error);
  //     }
  //   }
  //   fetchData();
  // }, [selectedCategory]);

 // 이부분이 선택된 강사의 DATA를 DB에서 가져오는 거
 
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
        
  //       const response = await fetch('api');
  //       if (!response.ok) {
  //         throw Error('Failed to fetch data from the server.');
  //       }
  //       const data = await response.json();
  //       setTeachers(data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   }
  //   fetchData();
  // }, []);

  const onShowDetails = (item) => {
    setSelectedTeacher(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTeacher(null);
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topBar}>
          <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
          <Text style={styles.title}>강사 정보</Text>
        </View>
      </View>
      <View style={styles.categori}>
        <TouchableOpacity style={styles.all} onPress={() => setSelectedCategory('All')}>
          <Text style={styles.cancelButtonText}>전체</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ski} onPress={() => setSelectedCategory('Ski')}>
          <Text style={styles.cancelButtonText}>스키</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.board} onPress={() => setSelectedCategory('Board')}>
          <Text style={styles.cancelButtonText}>보드</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.teacherContent}>
              <Image source={item.image} style={styles.teacherImage} />
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>{item.name}</Text>
                <Text style={styles.subjectText}>{item.introduce}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: levelColors[item.level] }]}>
                <Text style={styles.skilevel}>{item.level}</Text>
              </View>
              <Image source={eachsubject[item.subject]} style={styles.subjectImage} />
              <TouchableOpacity style={styles.cancelButton} onPress={() => onShowDetails(item)}>
                <Text style={styles.cancelButtonText}>상세보기</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        {selectedTeacher && (
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                  <TransparentCircleButton onPress={closeModal} name="left" color="#424242" />
                </TouchableOpacity>
            <ScrollView style={styles.modalContent}>
              <View style={styles.modalinfoimage}>
                <Image source={selectedTeacher.image} style={styles.modalTeacherImage} />
                <Text style={styles.modalItemText}>{selectedTeacher.name}</Text>
                <Text style={styles.modalSubjectText}>{selectedTeacher.introduce}</Text>
              </View>
              <Text style={styles.yaks}>약력</Text>
              {selectedTeacher.yak && selectedTeacher.yak.map((item, index) => (
                <Text style={styles.yak} key={index}>{item}</Text>
              ))}
              <Swiper autoplay={true} style={{ marginTop: 10, height: 200}}>          
                <View style={styles.swiperSlide}>
                  <Image source={require('../Images/SnoweFirst.jpg')} style={styles.swiperImage} />  
                </View>
                <View style={styles.swiperSlide}>
                  <Image source={require('../Images/snow.jpg')} style={styles.swiperImage} />
                </View>
                <View style={styles.swiperSlide}>
                  <Image source={require('../Images/snowee.jpg')} style={styles.swiperImage} />
                </View>
               </Swiper>
               <Text style={styles.carrers}>경력</Text>
              {selectedTeacher.yak && selectedTeacher.carrer.map((item, index) => (
                <Text style={styles.carrer} key={index}>{item}</Text>
              ))}
               <Text style={styles.teams}>소속</Text>
              {selectedTeacher.team && selectedTeacher.team.map((item, index) => (
                <Text style={styles.team} key={index}>{item}</Text>
              ))}
            </ScrollView>
          </View>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  teacherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subjectText: {
    fontSize: 16,
    marginTop: 8,
  },
  cancelButton: {
    width: '20%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  all: {
    width: '12%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  ski: {
    width: '12%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  board: {
    width: '12%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  cancelButtonText: {
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginRight: 30,
  },
  skilevel: {
    marginRight: 0,
    fontSize: 15,
  },
  categori: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    borderRadius: 4,
    width: 'auto',
    marginRight: 15,

  },
  subjectImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'

  },
  modalContent: {
    backgroundColor: '#DBEBF9',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    height: '100%',
  },
  modalTeacherImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 60,

  },
  modalItemText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  modalSubjectText: {
    fontSize: 18,
    marginTop: 10,
  },
  modalCloseButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 10,
    zIndex: 1,
    marginTop: 40,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalinfoimage: {
    alignItems: 'center',

  },
  yaks: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  carrers: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  teams: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  yak: {
    marginTop:10,
  },
  carrer: {
    marginTop:10,
  },
  team: {
    marginTop:10,
  },
  Imageforteacher:{
    marginTop:20,
    width: 190,
    height: 190,
  },
  swiperSlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperImage: {
    width: '100%',
    height: '100%',
  },
});

export default TeacherInfoScreen;



