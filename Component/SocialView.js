import React, {useContext, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FeedList from './FeedList';
import FloatingWriteButton from './FloatingWriteButton';

function SocialView() {
  const [hidden, setHidden] = useState(false);

  const onScrolledToBottom = isBottom => {
    if (hidden !== isBottom) {
      setHidden(isBottom);
    }
  };
  //보기용 글
  const myLogs = [
    {
      id: '1',
      title: '내 첫 번째 글',
      body: '이것은 내 첫 번째 글입니다.',
      date: '2023-10-03T12:00:00Z',
    },
    // 다른 글들도 추가할 수 있음
  ];

  return (
    <View style={styles.block}>
      <FeedList logs={myLogs} onScrolledToBottom={onScrolledToBottom} />
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