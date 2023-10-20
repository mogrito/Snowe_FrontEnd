import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const onSearch = () => {
    // 검색 로직을 구현하고 검색 결과를 setSearchResults로 설정
    // setSearchResults([...]); // 검색 결과를 설정
  };

  const onGoBack = () => {
    navigation.pop();
  };


  return (
    <View style={styles.container}>
      {/* 내비게이션 헤더 영역 */}
      <View style={styles.header}>
        <TransparentCircleButton
            onPress={onGoBack}
            name="arrow-back"
            color="black"
          />
        <Text style={styles.title}>검색 화면</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="검색어를 입력하세요"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="검색" onPress={onSearch} />
      {/* 검색 결과를 표시 (searchResults 배열을 매핑하여 화면에 렌더링) */}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center', // 수평 가운데 정렬을 추가
      marginBottom: 20,
      top: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginLeft: 10, // 이 부분은 삭제해주세요
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
  });
  

export default SearchScreen;
