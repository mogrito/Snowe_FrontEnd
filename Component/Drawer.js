import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialCommunityIcons,FontAwesome,Foundation } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkTokenAndNavigate } from './TokenUtils';
import { getTokenFromLocal } from './TokenUtils';
export function CustomDrawerContent({ navigation }) {

  return (
    <DrawerContentScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 19 }}>
        <Image
          source={require('../Images/UserIcon.jpg')}
          style={{ width: 72, height: 72, borderRadius: 36 }}
        />
        <TouchableOpacity onPress={() => checkTokenAndNavigate(navigation)}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>
            로그인하기
          </Text>
        </TouchableOpacity>
      </View>
      <DrawerItem
        label="마이페이지"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        )}
        onPress={async () => {
          const token = await getTokenFromLocal();
          console.log(token);
          if (token) {
            navigation.navigate('MyPage');
          }
          else{
            navigation.navigate('Login');
          }
        }}
      />
      <DrawerItem
        label="강사 마이페이지"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        )}
        onPress={async () => {
          const token = await getTokenFromLocal();
          console.log(token);
          if (token) {
            navigation.navigate('TeacherMyPage');
          }
          else{
            navigation.navigate('Login');
          }
        }}
      />
      <DrawerItem
        label="스키장 리스트"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="ski" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('SkiResortList')}
      />
      <DrawerItem
        label="예약 목록"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="account-clock" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('ReservationList')}
      />
       <DrawerItem
        label="강사자격 신청 및 등록"
        icon={({ color, size }) => (
          <FontAwesome name="id-card-o" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('TeacherVerify')}
      />
       <DrawerItem
        label="강습 등록"
        icon={({ color, size }) => (
          <Foundation name="page-edit" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('LessonSignUp')}
      />
    </DrawerContentScrollView>
  );
}
