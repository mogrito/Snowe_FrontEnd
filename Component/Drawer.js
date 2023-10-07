import React from 'react';
import { Text, View, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function CustomDrawerContent({ navigation }) {
  return (
    <DrawerContentScrollView>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20 }}>
        <Image
         source={require('../Images/face.jpg')}
          style={{ width: 72, height: 72, borderRadius: 36 }}
        />
        <Text style={{ fontSize: 26, fontWeight: 'bold', marginLeft: 10 }}>원빈님</Text>
      </View>
      <DrawerItem
        label="홈"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('MainView')}
      />
      <DrawerItem
        label="게시글"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="account-group" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('SocialView')}
      />
      <DrawerItem
        label="마이페이지"
        icon={({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        )}
        onPress={() => navigation.navigate('Login')}
      />
    </DrawerContentScrollView>
  );
}
