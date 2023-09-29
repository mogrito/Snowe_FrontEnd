import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

export default function SocialScreen({ navigation }) {
  const { width, height } = Dimensions.get('window');

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('SocialView')}
        style={{
          backgroundColor: 'blue',
          padding: 20,
          borderRadius: 10,
        }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>
          SocialScreen ({width}x{height})
        </Text>
      </TouchableOpacity>
    </View>
  );
}
