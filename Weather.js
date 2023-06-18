import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image, Button, ScrollView,TouchableOpacity, TouchableHighlight,Dimensions, } from 'react-native';
import { useState,useEffect, useRef } from 'react';
import { Icon } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons'; 
import { SelectList } from 'react-native-dropdown-select-list'
import { MaterialIcons } from '@expo/vector-icons'; 
import {useData, useDataDispatch} from './DataContext.js'

import { getWeather, cancelWeather } from './open-weather-map.js';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const Weather = () => {
  const {settings: {color}} = useData();

    const [weather, setWeather] = useState(initWeatherState);

    async function fetchWeather(city, unit) {
      try {
        const weather = await getWeather(city, unit);
        setWeather({ ...weather });
      } catch (err) {
        console.error('Error getting weather', err);
        setWeather({...initWeatherState});
      }
    }
  
    useEffect(() => {
      fetchWeather('Hsinchu', 'metric');
      console.log(weather)
    }, []);
    const path = './images/w-'+weather.group+'.png'
  
    return (
        <View style={styles.container}>
            <View style={styles.left}>
              
              < Image style={{
                // zIndex:-1,
                position : "absolute",
                width:170,
                height:110,
                top:screenHeight*0.03,
                // backgroundColor:'red',
                left:190, 
                // opacity:0.8
                }} 
                source={require('./images/w-clouds.png')} 
                />
                {/* can not change image as i need */}
                {/* <Text>{path} </Text> */}

                {/* <Text style={styles.location}>
                  {weather.description}
                </Text> */}

                <View style = {{flexDirection: "row",marginLeft:40,marginTop:20 }}>
                  <MaterialIcons name="location-on" size={24} color={color} />

                  <View >
                      <Text style={{fontSize:20,marginLeft:10 , color:color}}>
                          {weather.city}
                      </Text>
                  </View>
                </View>

                
                <View style={styles.degree}>
                    <Text style={{fontSize:60, marginLeft:30,marginTop:20,color:color}}>
                        {weather.temp.toFixed(0) + ' C'}
                    </Text>
                </View>
                
            </View>
            <View style={styles.right}>
                
                <View style={styles.last_update}>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      width: 180,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    left:{

    },
    right:{

    },
    location:{

    },
    degree:{

    },
    weather_icon:{

    },
    last_update:{

    }
  });

const initWeatherState = {
    city: 'na',
    code: -1,
    group: 'na',
    description: 'N/A',
    temp: NaN,
};

export default Weather;