import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleLogin = () => {
    if (username === 'user' && password === '1234') {
      // Successful login, you can navigate to another screen here
      alert('Login successful!');
      navigation.navigate('MainView');
    } else {
      // Failed login, show an error message
      alert('Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={require('../Images/snowe.png')} style={styles.backgroundImage}/>
      
      {/* Title */}
      <Text style={styles.title}>Snowe</Text>
      
      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      
      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      
      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.linkContainer}>
        <TouchableOpacity>
          <Text style={styles.forgotId}>회원가입</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>아이디 찾기</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity>
          <Text style={styles.sign}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  title: {
    fontSize: 35,
    marginTop: 100,
    marginBottom: 15,
    fontStyle: 'normal',
    color: 'black',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  forgotPassword: {
    marginTop: 15,
    marginBottom: 15,
    color: 'black',
    textDecorationLine: 'underline',
  },
  forgotId: {
    marginTop: 15,
    marginBottom: 15,
    color: 'black',
    textDecorationLine: 'underline',
  },
  sign: {
    marginTop: 15,
    marginBottom: 15,
    color: 'black',
    textDecorationLine: 'underline',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '150%',
    height: '115%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: 'black',
  },
});

export default LoginScreen;

