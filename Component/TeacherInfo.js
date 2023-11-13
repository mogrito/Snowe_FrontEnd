import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, ScrollView,} from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
// import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';


//brief = 약력 carrer = 경력 team = 소속 

const levelColors = {
  LV01: 'lightgreen',
  LV02: 'lightblue',
  LV03: 'lightpink',
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
  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://192.168.25.204:8080/member/getTeacherList?ridingClass=${selectedCategory}`);
        if (!response.ok) {
          throw Error('서버에서 데이터를 가져오지 못했습니다.');
        }
        const data = await response.json();
        setTeachers(data);
        console.log(data);
      } catch (error) {
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    }
    fetchData();
  }, [selectedCategory]);

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
        data={teachers}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.teacherContent}>
              <Image source={item.image} style={styles.teacherImage} />
              <View style={styles.textContainer}>
                <View style={styles.headerimage}>
                  <Text style={styles.itemText}>{item.name}</Text>
                  <View style={[styles.badge1, { backgroundColor: levelColors[item.classLevel] }]}>
                    <Text style={styles.skilevel}>{item.classLevel}</Text>
                  </View>
                </View>
                <Text style={styles.subjectText}>{item.introduce}</Text>
              </View>
              <Image source={eachsubject[item.classification]} style={styles.subjectImage} />
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft:40 }}>
                  <Text style={styles.modalItemText}>{selectedTeacher.name}</Text>
                  <View style={[styles.badge1, { backgroundColor: levelColors[selectedTeacher.classLevel] }]}>
                    <Image source={eachsubject[selectedTeacher.classification]} style={styles.subjectImage} />
                    <Text style={styles.skilevel}>{selectedTeacher.classLevel}</Text>
                  </View>
                </View>
                <Text style={styles.modalSubjectText}>" {selectedTeacher.introduce} "</Text>
              </View>
              {/* <Swiper autoplay={true} style={{ marginTop: 10, height: 200}}>          
                <View style={styles.swiperSlide}>
                  <Image source={require('../Images/SnoweFirst.jpg')} style={styles.swiperImage} />  
                </View>
                <View style={styles.swiperSlide}>
                  <Image source={require('../Images/snow.jpg')} style={styles.swiperImage} />
                </View>
                <View style={styles.swiperSlide}>
                  <Image source={require('../Images/snowee.jpg')} style={styles.swiperImage} />
                </View>
               </Swiper>  */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.levels}>수준 : </Text>
                <View style={[styles.badge1, { backgroundColor: levelColors[selectedTeacher.classLevel] }]}>
                  <Image source={eachsubject[selectedTeacher.classification]} style={styles.subjectImage} />
                  <Text style={styles.skilevel}>{selectedTeacher.classLevel}</Text>
                </View>
              </View>
              <Text style={styles.histories}>약력</Text>
              {selectedTeacher.history && selectedTeacher.history.map((item, index) => (
                <Text style={styles.history} key={index}>{item}</Text>
              ))}
               <Text style={styles.carrers}>경력</Text>
              {selectedTeacher.career && selectedTeacher.carrer.map((item, index) => (
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
    fontSize: 15,
    color:'red',
    margin:4,
    marginBottom:5
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
    width: 18,
    height: 15,
    marginLeft:-1
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    height: '100%',
    backgroundColor: '#C7DBF7'
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
  levels: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    paddingBottom:20
  },
  histories: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
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
  history: {
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
    height: '110%',
    marginTop:40
  },
  headerimage:{
    flexDirection:'row'
  },
  badge1: {
    borderRadius: 4,
    marginLeft:5,
    marginTop:-1,
    padding:3,
    marginRight:10,
    height:25,
    flexDirection: 'row', 
    alignItems: 'center'
  },
});

export default TeacherInfoScreen;
