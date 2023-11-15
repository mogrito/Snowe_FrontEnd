import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { getTokenFromLocal } from './TokenUtils';

const AdminPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [teachersN, setTeachersN] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getTokenFromLocal();
        const authorizationHeader = `Bearer ${token}`;
  
        // 승인 목록 조회
        const responseApply = await axios.get('http://localhost:8080/admin/getApply', {
          headers: {
            Authorization: authorizationHeader,
          },
        });
        setTeachers(responseApply.data);
  
        // 미승인 강사 신청 목록 조회
        const responseApplyN = await axios.get('http://localhost:8080/admin/getApplyN', {
          headers: {
            Authorization: authorizationHeader,
          },
        });
        setTeachersN(responseApplyN.data);
      } catch (error) {
        console.error('Error fetching apply list:', error);
      }
    };
  
    fetchData();
  }, []);
// useEffect끝

const fetchData = async () => {
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;

      // 승인 목록 조회
      const responseApply = await axios.get('http://localhost:8080/admin/getApply', {
        headers: {
          Authorization: authorizationHeader,
        },
      });
    }
    

// 승인 버튼
const handleApproval = async (loginId) => {
    console.log("승인버튼");
    const token = await getTokenFromLocal();
    const authorizationHeader = `Bearer ${token}`;
    // 강사 승인 처리
    const result = window.confirm('승인하시겠습니까?');
    if (result) {
        await axios.post(`http://localhost:8080/admin/addteacher?loginId=${loginId}`, null, {
          headers: {
            Authorization: authorizationHeader,
          },
        });
        // 강사 승인 후 목록 다시 불러오기
        fetchData();
    }
    //toast.success('강사가 승인되었습니다.');
    alert("승인끝");
  };
  //승인끝

  //거절
  const handleRejection = (loginId) => {
    // 강사 거절 처리
    Alert.alert(
      '강사 거절',
      '거절하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          onPress: () => {
            axios.delete(`http://localhost:8080/admin/rejectteacher?loginId=${loginId}`)
              .then(response => {
                Alert.alert('강사 거절', response.data);
                // 강사 거절 후 목록 다시 불러오기
                fetchData();
              })
              .catch(error => console.error('Error rejecting teacher:', error));
          },
        },
      ],
      { cancelable: false }
    );
  };
  //거절끝

  const renderTeacherItem = ({ item, isUnapprovedList }) => (


    <View style={styles.teacherItem}>
      <Text>{`강사 ID: ${item.loginId}`}</Text>
      <Text>{`이름: ${item.name}`}</Text>
      <Text>{`승인 여부: ${item.stat === 'Y' ? '승인됨' : '거절됨'}`}</Text>
      {isUnapprovedList && (
        <View>
          <Text>{`신청 일자: ${item.applyDate}`}</Text>
          <Text>{`분류: ${item.classification}`}</Text>
          <Text>{`클래스 레벨: ${item.classification} ${item.classLevel}`}</Text>
          <Text>{`리조트명: ${item.resortName}`}</Text>
          <Text>{`약력: ${item.history}`}</Text>
          <Text>{`경력: ${item.career}`}</Text>
          <Text>{`소속 팀: ${item.team}`}</Text>
          <Text>{`소개: ${item.introduce}`}</Text>
          <View style={styles.buttonContainer}>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'green' }]}
              onPress={() => handleApproval(item.loginId)}
            >
              <Text style={styles.buttonText}>승인</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'red' }]}
              onPress={() => handleRejection(item.loginId)}
            >
              <Text style={styles.buttonText}>거절</Text>
            </TouchableOpacity>

          </View>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>승인된 강사 신청 목록</Text>
      <FlatList
        data={teachers}
        renderItem={({ item }) => renderTeacherItem({ item, isUnapprovedList: false })}
        keyExtractor={(item) => item.loginId.toString()}
      />

      <Text style={styles.title}>미승인 강사 신청 목록</Text>
      <FlatList
        data={teachersN}
        renderItem={({ item }) => renderTeacherItem({ item, isUnapprovedList: true })}
        keyExtractor={(item) => item.loginId.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  teacherItem: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    margin: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
  },
});

export default AdminPage;