import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as Location from 'expo-location';

const windowWidth = Dimensions.get('window').width;

function MainScreen() {
  const navigation = useNavigation();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 메뉴 아이콘을 누를 때 실행될 함수
  const handleUserIconPress = () => {
    navigation.openDrawer();
  };

  useEffect(() => {
    async function loadCustomFont() {
      await Font.loadAsync({
        DMSerifText1: require('../assets/fonts/DMSerifText1.ttf'),
      });
      setFontLoaded(true);
    }

    loadCustomFont();
  }, []);

  // 날씨 불러오는 로직 

  useEffect(() => {
    async function fetchWeather() {
      try {
        const apiKey = '28664d08fe65159df42d4ee6b227bacd';
  
        // 1. 위치 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();
  
        if (status !== 'granted') {
          console.error('위치 권한이 거부되었습니다.');
          return;
        }
  
        // 2. 현재 위치 정보 가져오기
        const location = await Location.getCurrentPositionAsync({});
  
        const lon = location.coords.longitude.toString();
        const lat = location.coords.latitude.toString();
  
        // 3. 날씨 정보를 가져오는 API 호출에 현재 위치 좌표를 사용합니다.
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
  
        if (!response.ok) {
          throw new Error('날씨 데이터를 가져올 수 없습니다');
        }
  
        const data = await response.json();
        setWeatherData(data); // 날씨 데이터 상태 업데이트
        setIsLoading(false); // 로딩 완료
        console.log(data); // 날씨 데이터 콘솔에 출력
      } catch (error) {
        console.error(error);
        setIsLoading(false); // 로딩 완료
      }
    }
  
    fetchWeather();
  }, []);

  return (
    <View style={styles.background}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={fontLoaded ? styles.title : {}}>Snowe</Text>
        <TouchableOpacity style={styles.userIcon} onPress={handleUserIconPress}>
          <MaterialIcons name="menu" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {/* 콘텐츠 */}
      <ScrollView contentContainerStyle={styles.body}>
        
        {/* 로딩 중인 경우 */}
        {isLoading && <Text>Loading...</Text>}

        {/* 날씨 컴포넌트 */}
        {!isLoading && weatherData && weatherData.main && ( 
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherText}>
              도시: {weatherData.name}
            </Text>
            <Text style={styles.weatherText}>
              온도: {(weatherData.main.temp - 273.15).toFixed(0)}°C 
            </Text>
            <Text style={styles.weatherText}>
              날씨 설명: {weatherData.weather[0].description} 
            </Text>
          </View>
        )}
        {/* 달력 컴포넌트 */}    
        <Calendar style={styles.calendar} />
        <Calendar style={styles.calendar} />
        <Calendar style={styles.calendar} />
        <Calendar style={styles.calendar} />
        <Calendar style={styles.calendar} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 40, 
    backgroundColor: '#EFF5FB',
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 1, 
  },
  title: {
    fontSize: 40,
    fontStyle: 'italic',
    color: 'black',
    fontFamily: 'DMSerifText1',
    left: 11,
  },
  userIcon: {
    marginTop: 5,
    right: 10,
  },
  calendar: {
    width: windowWidth * 0.9,
    marginTop: 20,
    
  },
  background: {
    flex: 1,
    backgroundColor: '#EFF5FB',
  },
  body: {
    alignItems: 'center',
    paddingTop: 50, 
  },
  weatherContainer: {
    width: windowWidth * 0.9,
    height: 90,
    marginBottom: 0,
    backgroundColor: 'skyblue',
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  weatherText: {
    textAlign: 'center', 
    fontSize: 18, 
  },

});

export default MainScreen;















