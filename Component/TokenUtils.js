import React, { useState , useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";


import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const URL = "http://192.168.25.202:8080/member/"; // API 엔드포인트 URL

export const getTokens = (loginId, password, navigation) => {
  const requestData = {
    loginId: loginId,
    password: password,
  };

  fetch(`${URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })
    .then(async (response) => {
      if (response.status === 200) {
        const responseData = await response.json();
        const accessToken = responseData.accessToken;
        const userId = responseData.userId;

        // 토큰 만료 시간 설정 (예: 30분)
        const expirationTime = new Date().getTime() + 30 * 60 * 1000;

        // 로컬 스토리지에 토큰 및 만료 시간 저장
        await AsyncStorage.setItem('AccessToken', JSON.stringify({
          accessToken,
          expirationTime,
          userId,
        }));

        navigation.navigate('HomeTab');
      }
    })
    .catch((error) => {
      if (error.response.status === 401) {
        showToast(error.response.data);
      } else {
        showToast("x");
      }
    });
};

export const getAccessToken = async () => {
    try {
        const value = await AsyncStorage.getItem('AccessToken');
        if (value !== null) {
            const { accessToken, expirationTime, userId } = JSON.parse(value);
            const currentTime = new Date().getTime();
            // 토큰이 만료되지 않았으면 반환
            if (currentTime < expirationTime) {
                return accessToken;
            }
        }
        return null;
    } catch (e) {
        console.log(e.message);
        return null;
    }
};

export const verifyTokens = async (navigation) => {
    const accessToken = await getAccessToken();

    if (accessToken) {
        // 토큰이 있으면 자동 로그인
        navigation.navigate('HomeTab');
    } else {
        // 토큰이 없거나 만료된 경우 로그인 페이지로 이동
        navigation.reset({ routes: [{ name: "AuthPage" }] });
    }
};