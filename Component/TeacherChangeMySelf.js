import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';

//현재 작성된 한 줄 소개글을 useEffect를 통해 인풋박스에 불러오고 수정작업을 하고 변경하기 버튼을 누르면 'handleChangeMySelfInfo' 이벤트 발생

const TeacherChangeMySelfScreen = ({ navigation }) => {
  const [shortinfo, setShortinfo] = useState(''); //shortinfo는 현재 자신의 한 줄 소개

//현재 한줄 소개를 불러오는 API
  useEffect(() => {
    fetch('서버의_API/currentShortInfo')
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setShortinfo(data.shortinfo);
        } else {
        
        }
      })
      .catch(error => {
        console.error('에러:', error);
      });
  }, []); 

  const onGoBack = () => {
    navigation.pop();
  };

  //변경된 한 줄 소개 글을 다시 업데이트 하는 API
  const handleChangeMySelfInfo = () => {
    fetch('서버의_API/updateShortInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newShortInfo: shortinfo,  // 변경된 한 줄 소개 글
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert('한 줄 소개가 성공적으로 변경되었습니다!');
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
        <Text style={styles.title}>한 줄 소개 설정</Text>
      </View>

      <View>
        <View style={styles.text}>
          <Text style={styles.inputLabel}>내 한 줄 소개</Text>
          <Text style={styles.rightText}>한 줄 소개를 최대 12자 내외로 작성해 주세요</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input3}
            placeholder="현재 한 줄 소개"
            value={shortinfo}
            multiline={true}  
            returnKeyType="next" 
            onChangeText={text => setShortinfo(text)}
            maxLength={12} 
          />

        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleChangeMySelfInfo}>
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
  resetButton: {
    height: 40,
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  resetText: {
    color: 'black',
  },
  input3: {
    flex: 1,
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingTop:10,
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightText: {
    fontSize: 12,
    color: 'gray',
    fontWeight: 'bold',
    marginTop:2,
  },
});

export default TeacherChangeMySelfScreen;
