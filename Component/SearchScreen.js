import React, { useState,useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons} from '@expo/vector-icons';
import TransparentCircleButton from './TransparentCircleButton';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSearchTypeText, setSelectedSearchTypeText] = useState('검색 대상');
  const navigation = useNavigation();

  const onSearch = async () => {
    try {
      const keyword = encodeURIComponent(searchText);
      let searchTypeEndpoint = '';
      if (searchType === 'title'){
        searchTypeEndpoint = 'title';
      }
      else if (searchType === 'content') {
        searchTypeEndpoint = 'content';
      }
      else if(searchType === 'login_id'){
        searchTypeEndpoint = 'writer';
      }
      else if(searchType === 'title_content'){
        searchTypeEndpoint = 'title_content';
      }
      else {
        alert('검색 대상을 선택 해 주세요.');
      }

      const response = await fetch(`http://192.168.25.204:8080/board/search?searchType=${searchTypeEndpoint}&keyword=${keyword}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToPost = (post) => {
    navigation.navigate('PostView', { ...post });
  };

  const onGoBack = () => {
    navigation.goBack(); // 뒤로가기 동작 추가
  };

  const handleSearchTypeSelect = (selectedType, buttonText) => {
    setSearchType(selectedType);
    setSelectedSearchTypeText(buttonText);
    setIsModalVisible(false);
  };

  useEffect(() => {
    loadSearchHistory(); // 검색 기록을 불러오기
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history !== null) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <View style={{marginLeft:10}}>
          <TransparentCircleButton onPress={onGoBack} name="left" size={30} color="black" />
        </View>
        <View style={styles.searchTypeContainer}>
          <Button
            title={selectedSearchTypeText}
            onPress={() => setIsModalVisible(true)}
          />
        </View>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="검색어를 입력하세요"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        <MaterialIcons style={styles.search} name="search" onPress={onSearch} size={30} color="black" />
      </View>
      
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.title.toString()}
        renderItem={({ item }) => (
          <View style={styles.searchResultItem}>
            <Text onPress={() => navigateToPost(item)}>
              {item.title}
            </Text>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>검색 대상을 선택하세요:</Text>
            <Button title="제목" onPress={() => handleSearchTypeSelect('title', '제목')} />
            <Button title="내용" onPress={() => handleSearchTypeSelect('content', '내용')} />
            <Button title="제목+내용" onPress={() => handleSearchTypeSelect('title_content', '제목+내용')} />
            <Button title="작성자" onPress={() => handleSearchTypeSelect('login_id', '작성자')} />
            <Button title="닫기" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9'
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop:30,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 40, 
    backgroundColor: '#EFF5FB',
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 1, 
  },
  title: {
    fontSize: 40,
    fontStyle: 'italic',
    color: 'black',
    fontFamily: 'BalooRegular',
    marginLeft:-30
  },
  userIcon: {
    marginTop: 5,
    left: 10,
  },
  goBackButton: {
    flex: 1, // 뒤로가기 버튼이 화면 너비의 1/2를 차지
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    paddingTop:40,
  },
  searchTypeContainer: {
    flex: 3,
    paddingHorizontal: 1,
  },
  searchInputContainer: {
    flex: 7,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: 'white',
  },
  searchResultItem: {
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  search:{
    paddingRight:10,
    paddingTop:5,
    paddingLeft:10
  }
});

export default SearchScreen;