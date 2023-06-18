import React, {useState} from 'react';
import {SafeAreaView,Dimensions, StyleSheet,TouchableOpacity, TextInput, View, Text,Button,Switch} from 'react-native';

// import Animated from 'react-native-reanimated';

import BusDetailCard from './BusDetailCard';
import MapView from 'react-native-maps';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const BusDetailContainer = () => {
    
    return (
      <View >
        
        {/* <Animated.ScrollView pagingEnabled style={styles.container}>
          <BusDetailCard title={'PAGE 1 '} index={0} />
          <BusDetailCard title={'PAGE 2'} index={1} />
        </Animated.ScrollView> */}
        <MapView  initialRegion={{
          latitude: 24.797119,
          longitude: 120.994375,
          latitudeDelta: 0.0461,
          longitudeDelta: 0.0210,
        }} 
      style={{position :"absolute",height: 1000,width: screenWidth}}/>
        
        <View style = {{ zIndex:1,position : "absolute",top:screenHeight*0.6,}}>

          <BusDetailCard/>
        </View>

      </View>
    );
  };
  
const styles = StyleSheet.create({
  
  container: {
    flex: 0,
    backgroundColor: '#fff',
  },
});

export default BusDetailContainer;




