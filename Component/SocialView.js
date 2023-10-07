import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FeedList from './FeedList';
import FloatingWriteButton from './FloatingWriteButton';

function SocialView() {
  const [hidden, setHidden] = useState(false);
  const [boardList, setBoardList] = useState([]);
  // 컴포넌트 마운트시 조s회함수 실행 
  useEffect(() => {
    fetchBoardData();
  }, []); 

  
  function fetchBoardData() {
    fetch('http://localhost:8080/board/list')
      .then(response => {
        const boardData = response.json();
        console.log(boardData);
        setBoardList(boardData);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const onScrolledToBottom = isBottom => {
    if (hidden !== isBottom) {
      setHidden(isBottom);
    }
  };
  

  return (
    <View style={styles.block}>
      {/* 게시판 데이터를 FeedList 컴포넌트에 전달 */}
      <FeedList logs={boardList} onScrolledToBottom={onScrolledToBottom} />
      <FloatingWriteButton hidden={hidden} />
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
});

export default SocialView;