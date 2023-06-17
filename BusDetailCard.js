import React, {useState} from 'react';

import {SafeAreaView, StyleSheet,TouchableOpacity, TextInput, View, Text,Button,Switch} from 'react-native';


const BusDetailCard = () => {

    return (
        // <View style = {styles.container}>
        //   <Text style={styles.text}>This is a card</Text>
        //   <Text>This is another card</Text>
        // </View>
        <Bus_card></Bus_card>
    );
  };
  
const styles = StyleSheet.create({

container: {
    marginTop :20,
    height: 100, 
    alignItems: 'center',
    justifyContent: 'center',
},

text: {
    fontSize: 20,
    color: '999',
    textTransform: 'uppercase',
    fontWeight: '700',
},

});


const Bus_card = (props) => {
  const screenHeight = Dimensions.get('window').height;
  const maxCardHeight = 0.5 * screenHeight;
  const screenWidth = Dimensions.get('window').width;
  const cardWidth = 1 * screenWidth;
  const half_screenWidth = 0.5 * screenWidth;

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [
          null,
          {
            dx: pan.x,
            dy: pan.y,
          },
        ],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    })
  ).current;

  const translateY = pan.y.interpolate({
    inputRange: [-maxCardHeight, 0],
    outputRange: [-maxCardHeight, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={Bus_card_styles.container}>
      <Animated.View
        style={[
          {
            transform: [{ translateX: 0 }, { translateY }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={[Bus_card_styles.card, { width: cardWidth }]} >
          
          <AntDesign style={[Bus_card_styles.extend_icon,{left:half_screenWidth-25}]} name="down" size={50} color="white" />     
          <ScrollView>
            <View>
              
            </View>
            <View></View>
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
};

const Bus_card_styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'absolute',
  },
  
  card: {
    height: 700,
    width: 1000,
    backgroundColor: '#858484',
    justifyContent: 'center',
    borderRadius: 40,
    alignSelf: 'center',
    marginTop: 1100,
  },
  extend_icon: {
    position: 'absolute',
    top:10
  },
  text:{
    color:'#fff',
    textAlign:'center',
    paddingLeft : 10,
    paddingRight : 10,
    zIndex:100,
},
});

export default BusDetailCard;