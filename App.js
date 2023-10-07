import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './Component/Login';
import MainScreen from './Component/MainView';
import FirstScreen from './Component/FirstView';
import RegisterScreen from './Component/Register';
import ForgotIdScreen from './Component/ForgetId';
import ForgotPasswordScreen from './Component/ForgetPassword';
import { CustomDrawerContent } from './Component/Drawer';
import SocialView from './Component/SocialView';

const Tab = createMaterialBottomTabNavigator();
const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [showFirstScreen, setShowFirstScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowFirstScreen(false);
    }, 2000); 
  }, []);

  return (
    <NavigationContainer>
      <RootStack.Navigator>
        {showFirstScreen ? (
          <RootStack.Screen
            name="FirstView"
            component={FirstScreen}
            options={{ headerShown: false }}r
          />
        ) : (
          <RootStack.Screen
            name="MainApp"
            component={MainAppNavigator}
            options={{ headerShown: false }}
          />
        )}
        
        <RootStack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ForgetId"
          component={ForgotIdScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ForgetPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

function MainAppNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={TabNavigator} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}



function TabNavigator() {
  return (
    <Tab.Navigator
      activeColor="#000000"
      inactiveColor="#000000"
      barStyle={{ backgroundColor: '#EFFBFB', height: 80 }}
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
        component={SocialView}
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
      <Tab.Screen
        name="Login"
        component={LoginScreen}
        options={{
          tabBarLabel: '마이페이지',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account"
              color={color}
              size={26}
            />
          ),
        }}
      /> 
    </Tab.Navigator>
  );
}




