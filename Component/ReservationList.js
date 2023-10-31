import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';
import { useNavigation } from '@react-navigation/native';

const data = [
  { id: '1', name: '강사 1' },
  { id: '2', name: '강사 2' },
  { id: '3', name: '강사 3' },
  // 나머지 데이터...
];

const ReservationListScreen = () => {
  const navigation = useNavigation();

  const onGoBack = () => {
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>예약 목록</Text>
        <View style={styles.buttonContainer}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="arrow-back"
            color="#424242"
          />
        </View>
      </View>
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
    marginRight: 1, // 오른쪽 여백 조정
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
