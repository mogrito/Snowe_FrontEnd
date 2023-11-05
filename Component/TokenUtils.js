import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


const URL = "http://192.168.219.103:8080/member"; // API 엔드포인트 URL
const onGoBack = () => {
  navigation.goBack();
};

export const getTokens = async (requestData, navigation) => {
  try {
    const response = await fetch(`${URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (response.status === 200) {
      const data = await response.json();
      await AsyncStorage.setItem('Tokens', JSON.stringify({
        'accessToken': data.token,
      }));
      console.log(await AsyncStorage.getItem('Tokens'));
      onGoBack();

    } else if (response.status === 401) {
      alert("사용자정보가 없습니다");
    } else {
      alert("알 수 없는 오류");
    }
  } catch (error) {
    console.error(error);
    alert("알 수 없는 오류");
  }
};

const getTokenFromLocal = async () => {
  try {
    const value = await AsyncStorage.getItem('Tokens');
    if (value !== null) {
      return JSON.parse(value).accessToken;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e.message);
    return null;
  }
};

export const checkTokenAndNavigate = async (navigation) => {
  const token = await AsyncStorage.getItem('Tokens');

  if (!token) {
    // 토큰이 없으면 로그인 화면으로 이동
    navigation.navigate('Login');
  }
};




export const verifyTokens = async () => {
  const token = await getTokenFromLocal();
  const authorizationHeader = `Bearer ${token}`;
  axios.get('http://192.168.25.202:8080/member/test', {
    headers: {
      'Authorization' : authorizationHeader,
    },
    })

   
    if (response.status === 200) {
        console.log('유효')
    } else {
        // 토큰이 없거나 만료된 경우 로그인 페이지로 이동
        navigation.reset({ routes: [{ name: "login" }] });
    }
  };


  export const getInfo = async () => {
    const token = await getTokenFromLocal();
    const authorizationHeader = `Bearer ${token}`;
    try {
      const response = await axios.get('http://192.168.25.202:8080/member/me', {
        headers: {
          'Authorization': authorizationHeader,
        },
      });
      
      const responseData = response.data;
      const name = responseData.name;
      const email = responseData.email;
      const user = {
        name,
        email,
    };
    return user;
      
    } catch (error) {
      // 오류 처리
      console.error('API 요청 중 오류 발생:', error);
    }
  };