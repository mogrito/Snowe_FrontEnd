import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();

  const onSearch = async () => {
    try {
      // 검색 로직을 구현하고 검색어를 `searchText`로 설정
      const searchType = 'title'; // 검색 대상을 선택하세요 (예: 제목, 내용)
      const keyword = encodeURIComponent(searchText); // 검색어를 URL 인코딩

      const response = await fetch(`http://192.168.25.204:8080/board/search?searchType=${searchType}&keyword=${keyword}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
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
        <Text style={styles.title}>게시글 검색</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="검색어를 입력하세요"
        value={searchText}
        onChangeText={setSearchText}
      />
      <Button title="검색" onPress={onSearch} />
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.title.toString()} // 고유한 키 필드로 변경하세요
        renderItem={({ item }) => (
          <View style={styles.searchResultItem}>
            <Text>{item.title}</Text> {/* 게시물의 필드에 맞게 변경하세요 */}
          </View>
        )}
      />
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
