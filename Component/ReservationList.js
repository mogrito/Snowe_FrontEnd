import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';


//예약 하드코딩 데이터들 
const data = [
  { id: '1', name: '강사 1'},
  { id: '2', name: '강사 2'},
  { id: '3', name: '강사 3'},
  { id: '4', name: '강사 4'},
  { id: '5', name: '강사 5'},
  { id: '6', name: '강사 6'},
  { id: '7', name: '강사 7'},
  { id: '8', name: '강사 8'},
  { id: '9', name: '강사 9'},
  { id: '10', name: '강사 10'},
  { id: '11', name: '강사 11'} ,
  { id: '12', name: '강사 12'},
  { id: '13', name: '강사 13'}
];

const SkiResortPress = () => {



};



const ReservationListScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>예약 목록</Text>
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

export default ReservationListScreen;