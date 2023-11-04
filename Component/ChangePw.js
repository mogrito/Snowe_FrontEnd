import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';

const windowWidth = Dimensions.get('window').width;

const ChangePwScreen = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isPasswordMatching, setIsPasswordMatching] = useState(true);
  const [showPasswordHint, setShowPasswordHint] = useState(false);


  const onConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    setIsPasswordMatching(password === text);
  };

  const onCurrentPasswordChange = (text) => {
    setCurrentPassword(text);
  };

  const onPasswordChange = (text) => {
    setPassword(text);
    setShowPasswordHint(text.length > 0); // Show the hint when the user enters data
  };

  const onGoBack = () => {
    navigation.pop();
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TransparentCircleButton
          onPress={onGoBack}
          name="arrow-back"
          color="#424242"
        />
        <Text style={styles.title}>비밀번호 설정</Text>
      </View>

      <View>
        <Text style={styles.inputLabel}>새 비밀번호</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="새 비밀번호"
            secureTextEntry={true}
            value={password}
            onChangeText={onPasswordChange}
          />
        </View>
        {showPasswordHint && password.length < 8 ? (
          <Text style={styles.checkpw1}>비밀번호 8자 입력 이상 입력해주세요.</Text>
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
            value={currentPassword}
            onChangeText={onCurrentPasswordChange}
          />
        </View>
        <TouchableOpacity style={styles.resetButton}>
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
    marginTop:-20,
  },
  resetButton: {
    height: 40, // 변경된 부분: 높이 40으로 설정
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize:13,
    marginBottom:30,
    marginTop:-25,
  },
  checkpw1: {
    fontSize:13,
    marginBottom:30,
    marginTop:-25,
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
});


export default ChangePwScreen;