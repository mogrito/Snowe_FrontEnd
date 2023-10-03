import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native'; // Navigation 기능을 사용하기 위한 import
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';

const Stack = createStackNavigator();

function MainScreen() {
  const screenWidth = Dimensions.get('window').width;
  const navigation = useNavigation(); // navigation 객체 생성
  const [fontLoaded, setFontLoaded] = useState(false);
  // 사용자 아이콘을 누를 때 실행될 함수
  const handleUserIconPress = () => {
    navigation.navigate('Login'); 
  };

  useEffect(() => {
    // Load the custom font asynchronously
    async function loadCustomFont() {
      await Font.loadAsync({
        DMSerifText1: require('../assets/fonts/DMSerifText1.ttf'), // 폰트 경로를 업데이트하세요
      });
      setFontLoaded(true);
    }
  
    loadCustomFont();
  }, []);





  return (
    <View style={styles.background}>
      {/* 왼쪽 상단에 위치한 앱 제목 */}
     <Text style={fontLoaded ? styles.title : {}}>Snowe</Text>
      
      {/* 오른쪽 상단에 위치한 사용자 아이콘 */}
      <TouchableOpacity style={styles.userIcon} onPress={handleUserIconPress}>
        <MaterialIcons name="person" size={30} color="black" />
      </TouchableOpacity>
      
      {/* 달력 컴포넌트 */}
      <View style={styles.jumbotron}>
        <Calendar style={styles.calendar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    marginTop: 30,
    marginLeft: 10,
    fontStyle: 'italic',
    color: 'black',
    position: 'absolute',
    top: 20,
    left: 10,
    fontFamily:'DMSerifText1',
  },
  userIcon: {
    position: 'absolute',
    marginTop: 45,
    top: 20,
    right: 14, // 오른쪽 상단에 위치
  },
  jumbotron: {
    padding: 20,
    borderRadius: 10,
  },
  calendar: {
    width: '150%',
    height: 400,
    position: 'relative',
    left: -Dimensions.get('window').width / 7.3,
    top: -100,
  },
  background: {
    flex: 1,
    backgroundColor: '#EAF9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainScreen;












