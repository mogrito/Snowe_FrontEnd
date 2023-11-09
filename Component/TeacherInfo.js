import React, { useState,useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal, ScrollView,} from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import { useNavigation} from '@react-navigation/native';


// const data = [
//   { id: '1', name: '원빈', classname: '스키초급반', image: require('../Images/face.jpg'), count: 0, edudate: '09:00',subject:'스키',level:'초급' },
//   { id: '2', name: '주성', classname: '보드초급반', image: require('../Images/face1.jpg'), count: 0, edudate: '17:00',subject:'보드',level:'중급'},
//   { id: '3', name: '정훈', classname: '스키초급반', image: require('../Images/face2.jpg'), count: 0, edudate: '11:00',subject:'스키',level:'고급' },
// ];


  //DB에서 필요한 데이터는 선생님 이름 name 이랑 종목 이름 subject 반 이름 classname id는 선생님 고유 번호


const TeacherInfoScreen = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('선생님 데이터 받아오는 API')
      .then((response) => response.json())
      .then((data) => {
        setTeachers(data); 
      })
      .catch((error) => console.error('Error fetching data: ', error));
  }, []);


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
      <FlatList
        data={teachers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.teacherContent}>
              <Image source={item.image} style={styles.teacherImage} />
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>{item.name}</Text>
                <View style={styles.subjectContainer}>
                  <Text style={styles.subjectText}>{item.classname}</Text>
                </View>
                <Text style={styles.itemText}>{item.subject}/{item.level}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onCancel(item.id)}
                style={styles.cancelButton}
              >
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
                <Text style={styles.modalSubjectText}>" {selectedTeacher.introduce} "</Text>
              </View>
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
              <Text style={styles.yaks}>약력</Text>
              {selectedTeacher.yak && selectedTeacher.yak.map((item, index) => (
                <Text style={styles.yak} key={index}>{item}</Text>
              ))}
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
  buttonContainer: {
    marginRight: 1, 
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
    marginLeft: 10,
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    marginBottom: -5, 
    marginTop: -5, 
  },
  subjectContainer: {
    alignItems: 'center', 
    marginBottom: 0, 
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
    marginRight:30,
  },
});

export default TeacherInfoScreen;