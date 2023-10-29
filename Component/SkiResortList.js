import React from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//스키장 데이터들 
const data = [
  { id: '1', name: '지산 포레스트 리조트 스키장', location: { latitude: 37.217279, longitude: 127.3448638 } },
  { id: '2', name: '휘닉스 평창 스노우 파크', location: { latitude: 37.5828503, longitude: 128.3237574 } },
  { id: '3', name: '할펜시아 리조트 스키장', location: { latitude: 37.6581029, longitude: 128.672847 } },
  { id: '4', name: '알펜시아 리조트 스키장', location: { latitude: 37.6581029, longitude: 128.672847 } },
  { id: '5', name: '엘리시안 강촌스키장', location: { latitude: 37.8163989, longitude: 127.587019 } },
  { id: '6', name: '무주 덕유산 리조트스키장', location: { latitude: 35.8902945, longitude: 127.7375075 } },
  { id: '7', name: '오크밸리 스키장', location: { latitude: 37.4023124, longitude: 127.8122233 } },
  { id: '8', name: '에덴밸리 리조트스키장', location: { latitude: 35.4290765, longitude: 128.9844681 } },
  { id: '9', name: '모나 용평리조트 스키장', location: { latitude: 37.6457252, longitude: 128.6806395 } },
  { id: '10', name: '웰리힐리파크 스노우파크', location: { latitude: 37.4856398, longitude: 128.2474111 } },
  { id: '11', name: '오투 리조트 스키장', location: { latitude: 37.1773859, longitude: 128.9478083 } },
  { id: '12', name: '비발디파크 스키장', location: { latitude: 37.6452535, longitude: 127.6818841 } },
];


const SkiResortListScreen = () => {
  const navigation = useNavigation();

  const handleResortPress = (item) => {
    navigation.navigate('MainView', { selectedResort: item ,selectedResortName : item.name });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>방문하게 될 스키장을 선택해주세요</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleResortPress(item)}>
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
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
    fontSize: 25,
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