import React from 'react';
import { View, Text, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const data = [
  { 
    id: '1', 
    name: '지산 포레스트 리조트 스키장', 
    location: { latitude: 37.217279, longitude: 127.3448638 }, 
    webcam: 'https://www.jisanresort.co.kr/m/ski/slopes/webcam.asp',
    bus: 'https://www.jisanresort.co.kr/w2021/reservation/shuttle/reservation.asp',
    condo: 'https://www.jisanresort.co.kr/w/reservation/condo/condo.asp'
  },
  { 
    id: '2', 
    name: '휘닉스 평창 스노우 파크', 
    location: { latitude: 37.5828503, longitude: 128.3237574 }, 
    webcam: 'https://phoenixhnr.co.kr/page/pyeongchang/guide/operation/sketchMovie',
    bus: 'https://phoenixhnr.co.kr/static/pyeongchang/guide/traffic/bus-free',
    condo: 'https://phoenixhnr.co.kr/static/pyeongchang/room/blue/sky-standard',
  },
  { 
    id: '3', 
    name: '알펜시아 리조트 스키장', 
    location: { latitude: 37.6581029, longitude: 128.672847 }, 
    webcam: 'https://www.alpensia.com/guide/web-cam.do',
    bus: 'https://m.alpensia.com/guide/directions-public.do?lang=ko',
    condo: 'https://www.alpensia.com/accomm/main.do',
  },
  { 
    id: '4', 
    name: '엘리시안 강촌스키장', 
    location: { latitude: 37.8163989, longitude: 127.587019 }, 
    webcam: 'https://www.elysian.co.kr/gangchon/ski/ski_slope03.asp',
    bus: 'https://www.elysian.co.kr/reservation/free_shuttle.asp?rcd=1&resv_site_gbn=&resv_menu_cd=D',
    condo: 'https://www.elysian.co.kr/gangchon/condo/condo_familyA.asp',
  },
  { 
    id: '5', 
    name: '무주 덕유산 리조트스키장', 
    location: { latitude: 35.8902945, longitude: 127.7375075 }, 
    webcam: 'https://www.mdysresort.com/guide.webcam.asp',
    bus: 'https://www.mdysresort.com/guide/shuttle_bus.asp',
    condo: 'https://www.mdysresort.com/accom/tirol_hotel.asp',
  },
  { 
    id: '6', 
    name: '오크밸리 스키장', 
    location: { latitude: 37.4023124, longitude: 127.8122233 }, 
    webcam: 'https://oakvalley.co.kr/oak_new/new_ski04.asp',
    bus: 'https://oakvalley.busro.net:456/rsvc/',
    condo: 'https://oakvalley.co.kr/room',
  },
  { 
    id: '7', 
    name: '에덴밸리 리조트스키장', 
    location: { latitude: 35.4290765, longitude: 128.9844681 }, 
    webcam: 'https://www.edenvalley.co.kr/CS/cam_pop1.asp',
    bus: 'https://www.edenvalley.co.kr/CS/View.asp?location=06-6',
  },
  { 
    id: '8', 
    name: '모나 용평리조트 스키장', 
    location: { latitude: 37.6457252, longitude: 128.6806395 }, 
    webcam: 'https://www.yongpyong.co.kr/kor/guide/realTimeNews/ypResortWebcam.do',
    bus: 'https://www.yongpyong.co.kr/kor/customer/location/bus01.do',
    condo: 'https://www.yongpyong.co.kr/kor/room/hotel.do',
  },
  { 
    id: '9', 
    name: '웰리힐리파크 스노우파크', 
    location: { latitude: 37.4856398, longitude: 128.2474111 }, 
    webcam: 'https://www.wellihillipark.com/home/customer/webcam',
    bus: 'https://www.wellihillipark.com/home/guide/map/shuttle',
    condo: 'https://www.wellihillipark.com/condo',
  },
  { 
    id: '10', 
    name: '오투 리조트 스키장', 
    location: { latitude: 37.1773859, longitude: 128.9478083 }, 
    webcam: 'https://www.o2resort.com/GDE/webcam.jsp',
    bus: 'https://www.o2resort.com/GDE/trafficBusSeoul.jsp',
    condo: 'https://www.o2resort.com/RSV/feeCondo.jsp',
  },
  { 
    id: '11', 
    name: '비발디파크 스키장', 
    location: { latitude: 37.6452535, longitude: 127.6818841 }, 
    webcam: 'https://www.sonohotelsresorts.com/daemyung.vp.utill.09_02_02_01.ds/dmparse.dm?areaType=S',
    bus: 'https://www.sonohotelsresorts.com/front.customer.notice.vpNoticeView.dp/dmparse.dm?nttId=14933&isNotice=N',
    condo: 'https://www.sonohotelsresorts.com/daemyung.vp.accomodation.index.ds/dmparse.dm',
  },
  { 
    id: '12', 
    name: '곤지암 리조트 스키장', 
    location: { latitude: 37.331614, longitude: 127.2837987 }, 
    webcam: 'https://www.konjiamresort.co.kr/ski/liveCam.dev',
    bus: 'https://m.konjiamresort.co.kr/ski/pickupService.dev',
    condo: 'https://reservation.konjiamresort.co.kr/view/main.do#Business',
  },
  { 
    id: '13', 
    name: '하이원 리조트 스키장', 
    location: { latitude: 37.2074566, longitude: 128.8253198 }, 
    webcam: 'https://www.high1.com/ski/slopeView.do?key=748&mode=p',
    bus: 'https://www.high1.com/www/contents.do?key=2194',
    condo: 'https://www.high1.com/hotelncondo/index.do',
  },
];



const sortedData = [...data];
sortedData.sort((a, b) => a.name.localeCompare(b.name));


const SkiResortListScreen = () => {
  const navigation = useNavigation();

  const handleResortPress = (item) => {
    navigation.navigate('TabNavigator', {
      screen: 'MainView', 
      params: {
        selectedResort: item,
        selectedResortName: item.name,
      },
    });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>방문하게 될 스키장을 선택해주세요</Text>
      <FlatList
        data={sortedData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleResortPress(item)}>
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
            </View>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    backgroundColor: 'white',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
  },
});

export default SkiResortListScreen;