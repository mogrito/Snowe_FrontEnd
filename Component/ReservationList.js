import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import { useNavigation } from '@react-navigation/native';

const data = [
  { id: '1', name: '원빈', subject: '스키초급반', image: require('../Images/face.jpg'), count: 0, edudate: '09:00' },
  { id: '2', name: '주성', subject: '보드초급반', image: require('../Images/face1.jpg'), count: 0, edudate: '17:00' },
  { id: '3', name: '정훈', subject: '스키초급반', image: require('../Images/face2.jpg'), count: 0, edudate: '11:00' },
];

const ReservationListScreen = () => {
  const navigation = useNavigation();

  const onGoBack = () => {
    navigation.pop();
  };

  //수강신청 취소 
  const onCancel = (reservationId) => {
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>예약 목록</Text>

        <View style={styles.buttonContainer}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="left"
            color="#424242"
          />
        </View>

      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.teacherImage} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.itemText}>{item.name}</Text>
                <View style={styles.subjectContainer}>
                  <Text style={styles.subjectText}>{item.subject}</Text>
                </View>
                <Text style={styles.itemText}>{item.edudate}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onCancel(item.id)}
                style={styles.cancelButton}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
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
    marginBottom: -5, 
    marginTop: -5, 
  },
  subjectContainer: {
    alignItems: 'center', 
    marginBottom: 0, 
  },
  subjectText: {
    fontSize: 16,
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
});

export default ReservationListScreen;
