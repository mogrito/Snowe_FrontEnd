import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ScrollView} from 'react-native';
import TransparentCircleButton from './TransparentCircleButton';



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
          <ScrollView>
              <View style={styles.profileContainer}>
                  <Image source={user.image} style={styles.profileImage}/>
                  <View style={styles.userInfoContainer}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
              </View>

              <View style={styles.accountContainer}>
                  <Text>계정</Text>
                  <View style={styles.account}>
                      <Text style={styles.accountName}>닉네임 변경</Text>
                      <Text style={styles.accountId}>아이디 변경</Text>
                      <Text style={styles.accountPw}>비밀번호 변경</Text>
                  </View>
              </View>

              <View style={styles.otherContainer}>
                
                  
              </View>
              <View style={styles.questionContainer}>
                  
              </View>
              </ScrollView>

              <View style={styles.logoutButtonContainer}>
                  <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                      <Text style={styles.logoutButtonText}>Log Out</Text>
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
    paddingTop: 100,
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
  },
  userEmail: {
    fontSize: 16,
  },
  logoutButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  logoutButton: {
    backgroundColor: 'skyblue',
    padding: 10,
    borderRadius: 5,
    width: '20%',
    alignSelf: 'flex-end',
    marginBottom: 40,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 11,
    flexDirection: 'row',
    justifyContent: 'center', // 수평 가운데 정렬
    alignItems: 'center', // 수직 가운데 정렬
  },
  title:{
  marginLeft: 144,
  fontSize:20,
  fontWeight:'bold'
  },

  accountContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: 'white',

  },

  otherContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: 'white',

  },
  
  questionContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    height: 100,
    borderRadius: 10,
    backgroundColor: 'white',

  },

  

});

export default MyPageScreen;
