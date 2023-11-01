import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons,FontAwesome5 } from '@expo/vector-icons';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from './Component/Login';
import MainScreen from './Component/MainView';
import FirstScreen from './Component/FirstView';
import RegisterScreen from './Component/Register';
import ForgotIdScreen from './Component/ForgetId';
import ForgotPasswordScreen from './Component/ForgetPassword';
import WriteScreen from './Component/WriteScreen';
import PostView from './Component/PostView';
import { CustomDrawerContent } from './Component/Drawer';
import SocialView from './Component/SocialView';
import TeacherReserveScreen from './Component/TeacherReserve';
import { LogContextProvider } from './context/LogContext';
import EditScreen from './Component/EditScreen';
import SearchScreen from './Component/SearchScreen';
import SkiResortListScreen from './Component/SkiResortList';
import ReservationListScreen from './Component/ReservationList';
import TeacherReserveTestScreen from './Component/TeacherReserveTest';


const Tab = createMaterialBottomTabNavigator();
const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator;

export default function App() {
  const [showFirstScreen, setShowFirstScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowFirstScreen(false);
    }, 2000); 
  }, []);

  return (
    <NavigationContainer>
      <LogContextProvider>
      <RootStack.Navigator>
        {showFirstScreen ? (
          <RootStack.Screen
            name="FirstView"
            component={FirstScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <RootStack.Screen
            name="Drawer"
            component={DrawerNavigator}
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
        <RootStack.Screen
          name="Write"
          component={WriteScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="게시판으로 가기"
          component={SocialView}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="PostView"
          component={PostView}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
            name="게시글 수정"
            component={EditScreen}
            options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
          <RootStack.Screen
          name="SkiResortList"
          component={SkiResortListScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ReservationList"
          component={ReservationListScreen}
          options={{ headerShown: false }}
        />
        </RootStack.Navigator>
      </LogContextProvider>
    </NavigationContainer>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: 'right',
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="SkiResortList" component={SkiResortListScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
      <Drawer.Screen name="MainView" component={MainScreen} options={{ headerShown: false }} />
      
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
        name="MainView1"
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
        name="TeacherReserve"
        component={TeacherReserveScreen}
        options={{
          tabBarLabel: '강사 예약',
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              name="chalkboard-teacher"
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
          tabBarLabel: '자유게시판',
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