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


export const verifyTokens = async (navigation) => {
const Token = await getTokenFromLocal();

// 최초 접속
if (Token === null){
  navigation.reset({routes: [{name: "Login"}]});
}
else{
  // 토큰을 헤더에 추가하여 요청을 보냅니다.
  const headers = {
    Authorization: `Bearer ${Token}`,
  };

  const response = await axios.get('http://192.168.219.103:8080/member/login', { headers });

  // 서버 응답을 처리합니다.
  console.log(response.data);

  };
}

