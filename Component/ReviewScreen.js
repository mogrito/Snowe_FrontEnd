import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getTokenFromLocal } from './TokenUtils';

const URL = 'http://192.168.25.202:8080';

const ReviewScreen = () => {
  const route = useRoute();
  const { lessonId, teacherId } = route.params; 

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [modalVisible, setModalVisible] = useState(true); // 모달 열기/닫기 상태
  const navigation = useNavigation();

  useEffect(() => {
    // reserveId, lessonId, teacherId 등을 사용하여 필요한 작업을 수행할 수 있습니다.
    console.log('Received Data:', lessonId, teacherId);
  }, [lessonId, teacherId]);

  const submitReview = async () => {
    try {
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;

      const response = await fetch(`${URL}/review/addReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authorizationHeader,
        },
        body: JSON.stringify({
          lessonId:lessonId,
          teacherId:teacherId,
          review:review,
        }),
      });

      if (response.ok) {
        alert('리뷰 제출 성공');
        setModalVisible(false);
      } else {
        alert('리뷰 제출 실패');
      }
    } catch (error) {
      console.error('리뷰 제출 중 오류 발생:', error);
    }
  };

    const closeModal = () => {
        setModalVisible(false);
        navigation.navigate('Reservation');
    };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.submitButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.submitButtonText}>리뷰 작성</Text>
      </TouchableOpacity> */}

      {/* 모달 컴포넌트 */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.title}>강의 리뷰 작성</Text>
          <View style={styles.ratingContainer}>
            <Text>평점:</Text>
            {/* 별점 입력을 위한 구현은 여기에 추가 */}
          </View>
          <TextInput
            style={styles.commentInput}
            placeholder="리뷰를 작성해주세요."
            multiline
            value={review}
            onChangeText={(text) => setReview(text)}
          />
          <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
            <Text style={styles.submitButtonText}>리뷰 제출</Text>
          </TouchableOpacity>

          {/* 모달 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>닫기</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  commentInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: 'skyblue',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReviewScreen;
