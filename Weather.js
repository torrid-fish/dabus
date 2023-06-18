import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView,TouchableOpacity, TouchableHighlight,Dimensions, } from 'react-native';
import { useState,useEffect, useRef } from 'react';
import { Icon } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons'; 
import { SelectList } from 'react-native-dropdown-select-list'
import { MaterialIcons } from '@expo/vector-icons'; 
import {useData, useDataDispatch} from './DataContext.js'

import { getWeather, cancelWeather } from './open-weather-map.js';

const Weather = () => {
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
    }, []);
  
    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <Text style={styles.location}>
                  {weather.description}
                </Text>

                <View style={styles.degree}>
                    <Text>
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