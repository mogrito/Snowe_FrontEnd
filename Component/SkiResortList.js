import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';


//스키장 데이터들 
const data = [
  { id: '1', name: '지산포레스트리조트 스키장' , location: 1 },
  { id: '2', name: '휘닉스 평창 스노우 파크' , location:2 },
  { id: '3', name: '할펜시아리조트스키장' , location: 3},
  { id: '4', name: '알펜시아리조트스키장' , location: 4},
  { id: '5', name: '엘리시안강촌스키장' , location: 5},
  { id: '6', name: '무주 덕유산 리조트스키장' ,location: 6},
  { id: '7', name: '오크밸리 스키장' , location: 7},
  { id: '8', name: '에덴밸리 스키장' , location: 8},
  { id: '9', name: '에덴밸리 리조트스키장' , location: 9},
  { id: '10', name: '모나 용평리조트 스키장' , location: 10},
  { id: '11', name: '웰리힐리파크스노우파크' , location: 11} ,
  { id: '12', name: '오투리조트 스키장' , location: 12},
  { id: '13', name: '비발디파크' , location: 13}
];

const SkiResortPress = () => {



};



const SkiResortListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>스키장 목록</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
  },
});

export default SkiResortListScreen;
