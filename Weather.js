import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView,TouchableOpacity, TouchableHighlight,Dimensions, } from 'react-native';
import { useState, useRef } from 'react';
import { Icon } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons'; 
import { SelectList } from 'react-native-dropdown-select-list'
import { MaterialIcons } from '@expo/vector-icons'; 
import {useData, useDataDispatch} from './DataContext.js'


const Weather = () =>{

    return (
        <View style={styles.container}>
            <View style={styles.left}>
                <View style={styles.location}>

                </View>
                <View style={styles.degree}>

                </View>
            </View>
            <View style={styles.right}>
                <Image style={styles.weather_icon}source={require('@expo/snack-static/react-native-logo.png')}/>
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

export default Weather;