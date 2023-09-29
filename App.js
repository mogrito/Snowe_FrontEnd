import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import LoginScreen from './Component/Login';
import MainScreen from './Component/MainView';
import SocialScreen from './Component/SocialView';
import FirstScreen from './Component/FirstView';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const Tab = createMaterialBottomTabNavigator();
const RootStack = createStackNavigator();

export default function App() {
  const [showFirstScreen, setShowFirstScreen] = useState(true);

  // 시작 화면을 메인 화면으로 자동으로 전환
  useEffect(() => {
    setTimeout(() => {
      setShowFirstScreen(false);
    }, 3000); 
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {showFirstScreen ? (
          <RootStack.Screen
            name="FirstView"
            component={FirstScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <RootStack.Screen
            name="MainApp"
            component={MainAppNavigator}
            options={{ headerShown: false }}
          />
        )}
        {/* 추가: 로그인 화면 */}
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function MainAppNavigator() {
  return (
    <Tab.Navigator
      activeColor="#000000"
      inactiveColor="#000000"
      barStyle={{ backgroundColor: '#2196f3', height: 80 }}
      tabBarOptions={{
        showLabel: true,
        labelStyle: { fontSize: 12 },
        activeTintColor: '#ffffff',
        inactiveTintColor: '#b0bec5',
        
      }}
    >
      <Tab.Screen
        name="MainView"
        component={MainScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SocialView"
        component={SocialScreen}
        options={{
          tabBarLabel: '게시글',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
