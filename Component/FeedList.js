import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import FeedListItem from './FeedListItem';

// FeedList 컴포넌트는 주어진 로그 목록을 표시하고, 사용자가 페이지 바닥에 스크롤하면 이벤트를 처리합니다.
// logs: 화면에 표시할 로그 목록
// onScrolledToBottom: 바닥에 도달했을 때 호출할 함수.!!.
// ListHeaderComponent: FlatList의 헤더로 표시할 컴포넌트
function FeedList({logs, onScrolledToBottom, ListHeaderComponent}) {
  const onScroll = e => {
    if (!onScrolledToBottom) {
      return;
    }

    const {contentSize, layoutMeasurement, contentOffset} = e.nativeEvent;
    
    const distanceFromBottom =
      contentSize.height - layoutMeasurement.height - contentOffset.y;

    if (
      contentSize.height > layoutMeasurement.height &&
      distanceFromBottom < 72
    ) {
      // console.log('바닥과 가까워요.');
      onScrolledToBottom(true);
    } else {
      // console.log('바닥과 멀어졌어요.');
      onScrolledToBottom(false);
    }
  };

  return (
    <FlatList
      data={logs}
      style={styles.block}
      renderItem={({item}) => <FeedListItem log={item} />}
      keyExtractor={log => log.id}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onScroll={onScroll}
      ListHeaderComponent={ListHeaderComponent}
    />
  );
}

const styles = StyleSheet.create({
  block: {flex: 1},
  separator: {
    backgroundColor: '#e0e0e0',
    height: 1,
    width: '100%',
  },
});

export default FeedList;