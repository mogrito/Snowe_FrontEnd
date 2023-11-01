import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native'; 
import axios from "axios";

export const getTokens = (loginId, password, navigation) => {
  axios.post(`http://192.168.219.103:8080/member/login`,
  {
    "loginId":loginId,
    "password":password
  })
  .then(res =>{{
        //accessToken, refreshToken 로컬에 저장
        if (res.status === 200){
          AsyncStorage.setItem('Tokens', JSON.stringify({
            'accessToken': res.data.token,
            'loginId': res.data.loginId
          }))
          console.log("응답 데이터:", res.data);
          navigation.navigate('MainView1');
        }

  }})
  .catch(error =>{
          if(error.response.status === 401){
              alert(error.response.data)
          }
          else{
              alert("알수없는 오류")
          } 
        
  })
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




export const verifyTokens = async () => {
    const token = await getTokenFromLocal();
    const response = await fetch(`${URL}/user`, {
      method: 'get',
      headers: {
        'Authorization' : token,
        'Content-Type': 'application/json',
      },
    })
    // user api 에 요청 -> 토큰을 검증
    if (response.status === 200) {
        console.log('유효') // 이게 안먹으면 navigate 로 mainview 쏴.
    } else {
        // 토큰이 없거나 만료된 경우 로그인 페이지로 이동
        navigation.reset({ routes: [{ name: "login" }] });
    }
  };
