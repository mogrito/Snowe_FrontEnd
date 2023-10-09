import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

function TeacherReserveScreen() {
  const [teacherData, setTeacherData] = useState([]);

  useEffect(() => {
    // 데이터를 불러올 API 
    const apiUrl = 'api';

    // 데이터 불러오는 로직임
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setTeacherData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.teacherWrapper}>
        <Text style={styles.title}>강사 예약</Text>
        <FlatList
          data={teacherData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.teacherItem}>
              <Text style={styles.teacherName}>{item.name}</Text>
              <Text style={styles.teacherSubject}>{item.subject}</Text>
            </View>
          )}
          style={styles.teacherList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFF5FB',
  },
  teacherWrapper: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  teacherItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
  },
  teacherName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  teacherSubject: {
    fontSize: 16,
    color: 'gray',
  },
  teacherList: {
    marginTop: 20,
  },
});

export default TeacherReserveScreen;



