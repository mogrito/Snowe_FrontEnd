import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native'; 
import axios from "axios";

const URL = 'http://192.168.219.103:8080';

export const getTokens = (loginId, password, navigation) => {
  axios.post(`${URL}/member/login`, {
    "loginId": loginId,
    "password": password
  })
    .then(res => {
      // accessToken, refreshToken 로컬에 저장
      if (res.status === 200) {
        AsyncStorage.setItem('Tokens', JSON.stringify({
          'accessToken': res.data.token,
        }))
        navigation.navigate('MainView1');
      }
    })
    .catch(error => {
      if (error.response.status === 401) {
        alert(error.response.data);
      } else {
        alert("사용자정보를 찾을수 없습니다.");
      }
    });
};

const getTokenFromLocal = async () => {
try {
  const value = await AsyncStorage.getItem("Tokens");
  if (value !== null) {
    return JSON.parse(value)
  }
  else{
    return null;
  }
} catch (e) {
  console.log(e.message);
}
};




export const verifyTokens = async (navigation) => {
  const token = await getTokenFromLocal();
  // 토큰을 서명형식에 맞게 조합

  const authorizationHeader = `Bearer ${token.accessToken}`;
    const response = await fetch(`${URL}`, {
      method: 'get',
      headers: {
        'Authorization' : authorizationHeader,
        'Content-Type': 'application/json',
      },
    })

   
    if (response.status === 200) {
        console.log('유효')
    }else if(response.status === 403){
        alert("권한이 없습니다.");
        navigation.navigate('MainView1')
    }else if(response.status === 401){
      navigation.navigate('Login');
      console.log('토큰없음');
      alert("로그인이 필요합니다.");
    }
  };
