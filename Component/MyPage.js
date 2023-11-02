import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView, Dimensions } from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';

const windowWidth = Dimensions.get('window').width;

const MyPageScreen = ({ navigation }) => {

  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    image: require('../Images/face.jpg'),
  };

  const handleLogout = async () => {
    // 로그아웃 로직
    await AsyncStorage.removeItem('userToken');
    navigation.navigate('Login'); // Navigate to the login screen
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
        <Text style={styles.title}>내 정보</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <Image source={user.image} style={styles.profileImage} />
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.accountContainer}>
          <Text style={styles.accountheader}>계정</Text>
          <View style={styles.account}>
            <Text style={styles.accountName}>닉네임 변경</Text>
            <Text style={styles.accountId}>아이디 변경</Text>
            <Text style={styles.accountPw}>비밀번호 변경</Text>
          </View>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionheader}>이용 안내</Text>
          <View style={styles.question}>
            <Text style={styles.appver}>앱 버전</Text>
            <Text style={styles.ask}>문의하기</Text>
            <Text style={styles.infor}>공지사항</Text>
            <Text style={styles.license}>오픈소스 라이선스</Text>
          </View>
        </View>
        <View style={styles.otherContainer}>
          <Text style={styles.otherheader}>기타</Text>
          <View style={styles.other}>
            <Text style={styles.logout}>로그아웃</Text>
            <Text style={styles.quit}>회원탈퇴</Text>
          </View>
        </View>
      </ScrollView>
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 60,
    marginLeft: 20,
  },
  userInfoContainer: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center', // 세로 가운데 정렬
    marginBottom: 20,
    marginRight:30,
  },
  title: {
    flex: 1, // 화면 중앙에 title을 위치시키기 위해 추가
    textAlign: 'center', // 가로 가운데 정렬
    fontSize: 20,
    fontWeight: 'bold',
  },
  accountContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  account: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    marginBottom: 25,
  },
  accountId: {
    fontSize: 16,
    marginBottom: 25,
  },
  accountPw: {
    fontSize: 16,
    marginBottom: 25,
  },
  accountheader: {
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  questionContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  question: {
    flex: 1,
  },
  appver: {
    fontSize: 16,
    marginBottom: 25,
  },
  ask: {
    fontSize: 16,
    marginBottom: 25,
  },
  infor: {
    fontSize: 16,
    marginBottom: 25,
  },
  license: {
    fontSize: 16,
    marginBottom: 25,
  },
  questionheader: {
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
  otherContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  other: {
    flex: 1,
  },
  logout: {
    fontSize: 16,
    marginBottom: 25,
  },
  quit: {
    fontSize: 16,
    marginBottom: 25,
  },
  otherheader: {
    fontSize: 18,
    marginBottom: 30,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default MyPageScreen;
