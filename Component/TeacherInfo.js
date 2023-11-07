import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import { useNavigation } from '@react-navigation/native';


const TeacherInfoScreen = () => {
  const [teachers, setTeachers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:8080/member/getTeacherList?ridingClass=${selectedCategory}`);
        if (!response.ok) {
          throw new Error('서버에서 데이터를 가져오지 못했습니다.');
        }
        const data = await response.json();
        setTeachers(data); // 데이터를 teachers 상태로 설정
        console.log(data);
      } catch (error) {
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    }
    fetchData();
  }, [selectedCategory]);

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
                  <Text style={styles.itemText}>{item.name}</Text>
                  <Text style={styles.subjectText}>{item.classname}</Text>
                </View>
                <Text style={styles.skilevel}>{item.level}</Text>  
                <TouchableOpacity
                  // onPress={openModal}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelButtonText}>상세보기</Text>
                </TouchableOpacity>
              </View>
            </View>
        )}
        showsVerticalScrollIndicator={false}
      />
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
    fontWeight:'bold',
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
    marginRight:5,
  },
  ski: {
    width: '12%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:5,
  },
  board: {
    width: '12%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:5,
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
  skilevel:{
    marginRight:50,
  },
  categori:{
    flexDirection: 'row',
    marginBottom:10,
  }

});