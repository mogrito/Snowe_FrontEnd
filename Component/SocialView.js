import React, { useState, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import FeedList from './FeedList';
import FloatingWriteButton from './FloatingWriteButton';
import LogContext from '../context/LogContext';
import { FlatList } from 'react-native-web';

function SocialView() {
  const [hidden, setHidden] = useState(false);
  const {logs} = useContext(LogContext);

  const onScrolledToBottom = (isBottom) => {
    if (hidden !== isBottom) {
      setHidden(isBottom);
    }
  };

  const myLogs = [
    {
      id: '111111',
      title: '내 첫 번째 글',
      body: '이것은 내 첫 번째 글입니다.',
      date: '2023-10-03T12:00:00Z',
    },
    // 다른 글들도 추가할 수 있음
  ];

  return (
    <View style={styles.block}>
      {/* 글 목록을 표시하는 FeedList 컴포넌트 */}
      <FeedList logs={myLogs} onScrolledToBottom={onScrolledToBottom} /> 
      {/* 글 작성 버튼을 표시하는 FloatingWriteButton 컴포넌트 */}
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