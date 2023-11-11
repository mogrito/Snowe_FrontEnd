import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';

const ChangePwScreen = ({ navigation }) => {
  const [newpassword, setnewpassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordMatching, setIsPasswordMatching] = useState(true);
  const [showPasswordHint, setShowPasswordHint] = useState(false);


  const onConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setIsPasswordMatching(newpassword === text);
  };

  const onCurrentPasswordChange = (text) => {
    setPassword(text);
  };

  const onPasswordChange = (text) => {
    setnewpassword(text);
  
   
    const hasNumber = /\d/.test(text);
  

    setShowPasswordHint(text.length > 0 && (!hasLetter || !hasNumber) || text.length < 8);
  };


  const onGoBack = () => {
    navigation.pop();
  };

  
  const handleChangePassword = () => {

    fetch('서버의_API', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: password,
        newPassword: newpassword,
        confirmPassword: confirmPassword,
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        
        alert('비밀번호가 성공적으로 변경되었습니다!')
      } else {

      }
    })
    .catch(error => {
      console.error('에러:', error);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
        <Text style={styles.title}>비밀번호 설정</Text>
      </View>

      <View>
        <View style={styles.text}>
        <Text style={styles.inputLabel}>새 비밀번호</Text>
        <Text style={styles.rightText}>영문,숫자 2종류 이상 조합된 8~20자</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호"
            secureTextEntry={true}
            value={newpassword}
            onChangeText={onPasswordChange}
          />
        </View>
        {showPasswordHint ? (
          <Text style={styles.checkpw}>
            {newpassword.length < 8
              ? '비밀번호 8자 입력 이상 입력해주세요.'
              : '영문, 숫자를 2종류 이상 조합해주세요.'}
          </Text>
        ) : null}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input1}
            placeholder="새 비밀번호 확인"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={onConfirmPasswordChange}
          />
        </View>

        {isPasswordMatching ? (
          password !== '' && confirmPassword !== '' ? (
            <Text style={styles.checkpw}>비밀번호가 일치합니다.</Text>
          ) : null
        ) : (
          <Text style={styles.checkpw}>비밀번호가 일치하지 않습니다.</Text>
        )}

        <Text style={styles.inputLabel}>현재 비밀번호</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input3}
            placeholder="현재 비밀번호"
            secureTextEntry={true}
            value={password}
            onChangeText={onCurrentPasswordChange}
          />
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleChangePassword}>
          <Text style={styles.resetText}>변경하기</Text>
        </TouchableOpacity>
      </View>
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
  input: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  input1: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    marginTop: -20,
  },
  resetButton: {
    height: 40,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:-20,
  },
  resetText: {
    color: 'black',
  },
  middleText: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'left',
  },
  checkpw: {
    fontSize: 13,
    marginBottom: 30,
    marginTop: -25,
  },
  input3: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  rightText: {
    fontSize:12,
    color: 'gray',
    fontWeight: 'bold',
  },
});

export default ChangePwScreen;
