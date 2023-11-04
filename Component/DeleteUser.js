import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions,Alert} from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';

const windowWidth = Dimensions.get('window').width;

const DeleteUserScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');

  const onCurrentPasswordChange = (text) => {
    setPassword(text);
  };

  const onDeleteUser = async () => {
    try {
      // API 호출을 사용하여 데이터베이스에서 사용자 정보, 비밀번호를 가져옵니다.
      const response = await fetch('사용자_정보_API_엔드포인트', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + '당신의_인증_토큰',
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const userData = await response.json();
        const userPasswordFromDB = userData.password; // 데이터베이스에서 사용자의 비밀번호 필드라고 가정합니다.
  
        if (password === userPasswordFromDB) {
          Alert.alert(
            '회원 탈퇴',
            '회원탈퇴를 진행하시겠습니까?',
            [
              {
                text: '아니요',
                onPress: () => {
                  // 사용자가 삭제를 취소한 경우
                },
                style: 'cancel',
              },
              {
                text: '예',
                onPress: async () => {
                  // 계정 삭제 로직을 처리.
                  try {
                    const deleteResponse = await fetch('API', {
                      method: 'DELETE',
                      headers: {
                        'Authorization': 'Bearer ' + '당신의_인증_토큰',
                        'Content-Type': 'application/json',
                      },
                    });
  
                    if (deleteResponse.ok) {
                      await AsyncStorage.removeItem('userToken');
                      navigation.navigate('MainView1');
                    } else {
                      console.error('회원탈퇴가 진행되지 않았습니다.');
                    }
                  } catch (error) {
                    console.error('계정 삭제 중 오류 발생:', error);
                  }
                },
              },
            ],
            { cancelable: false }
          );
        } else {
          Alert.alert('비밀번호 오류', '비밀번호가 일치하지 않습니다.');
        }
      } else {
        console.error('사용자 정보를 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('사용자 정보를 가져오는 동안 오류 발생:', error);
    }
  };
  
  const onGoBack = () => {
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TransparentCircleButton onPress={onGoBack} name="arrow-back" color="#424242" />
        <Text style={styles.title}>회원 탈퇴</Text>
      </View>
      <Text style={styles.inputLabel}>계정 비밀번호</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input3}
          placeholder="현재 비밀번호"
          secureTextEntry={true}
          value={password}
          onChangeText={onCurrentPasswordChange}
        />
      </View>

      <Text>※ 탈퇴 후 개인정보가 삭제되며, 복구할 수 없습니다.</Text>
      <Text>※ 다시 가입하여도,게시판,예약내역 등 기록은 초기화됩니다.</Text>
      <Text>※ 작성한 게시물은 삭제되며 복구할 수 없습니다.</Text>
      <Text>※ 자세한 내용은 개인정보처리방침을 확인해주세요.</Text>
      <TouchableOpacity style={styles.resetButton} onPress={onDeleteUser}>
        <Text style={styles.resetText}>탈퇴하기</Text>
      </TouchableOpacity>
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  input3: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginBottom: 5,
  },
  resetButton: {
    height: 40,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:30,
  },
  resetText: {
    color: 'black',
  },
});

export default DeleteUserScreen;
