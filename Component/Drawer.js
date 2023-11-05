import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function CustomDrawerContent({ navigation }) {
  return (
    <DrawerContentScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 19 }}>
        <Image
          source={require('../Images/UserIcon.jpg')}
          style={{ width: 72, height: 72, borderRadius: 36 }}
        />
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
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
        onPress={() => navigation.navigate('Login')}
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
    </DrawerContentScrollView>
  );
}
