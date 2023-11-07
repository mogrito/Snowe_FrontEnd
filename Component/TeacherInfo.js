import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Modal } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';

const data = [
  { id: '1', name: '원빈', introduce: '강해지고 싶나?', image: require('../Images/face.jpg'), count: 0, edudate: '09:00', subject: '스키', level: 'LV1' },
  { id: '2', name: '주성', introduce: '찾아라 원피스', image: require('../Images/face1.jpg'), count: 0, edudate: '17:00', subject: '보드', level: 'LV2' },
  { id: '3', name: '정훈', introduce: '아이스 에이지..', image: require('../Images/face2.jpg'), count: 0, edudate: '11:00', subject: '스키', level: 'LV3' },
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
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

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
        <View style={styles.modalContainer}>
          {selectedTeacher && (
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
                 <TransparentCircleButton onPress={closeModal} name="left" color="#424242" />
              </TouchableOpacity>
              <Image source={selectedTeacher.image} style={styles.modalTeacherImage} />
              <Text style={styles.modalItemText}>{selectedTeacher.name}</Text>
              <Text style={styles.modalSubjectText}>{selectedTeacher.introduce}</Text>
            </View>
          )}
        </View>
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
    marginRight:15,
    
  },
  subjectImage: {
    width: 50,
    height: 50,
    marginRight:12,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    
  },
  modalContent: {
    backgroundColor: '#DBEBF9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    width:'100%',
    height:'100%',
  },
  modalTeacherImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop:60,
    
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
    marginTop:30,
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default TeacherInfoScreen;



