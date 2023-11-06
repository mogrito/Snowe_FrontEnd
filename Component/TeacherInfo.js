import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import { useNavigation } from '@react-navigation/native';


const TeacherInfoScreen = () => {
  const navigation = useNavigation();
  const [teachers, setTeachers] = useState([]);

  
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
  }
});

export default TeacherInfoScreen;