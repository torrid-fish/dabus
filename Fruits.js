import React, {useState, useEffect, createContext, useContext, useReducer} from 'react';
import { View, Text, Button, Switch,ScrollView,Image ,StyleSheet,TouchableOpacity,Dimensions} from 'react-native';
import { useData, useDataDispatch, DataProvider } from './DataContext.js'; 
import Checkbox from './CheckBox.js';

import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const Fruit = () => {
    const screenHeight = Dimensions.get('window').height;
    
    const screenWidth = Dimensions.get('window').width;
    
    const {showFruit, newColor} = useData();
    const dispatch = useDataDispatch();
    const [expand, setExpand] = useState(false);

    // onPress = {() => dispatch({type: 'hideFruit'}})

    const handleExpandPress = () => {
        setExpand(!expand);
    };
    

    return(
        <View style={{top:0,position:"absolute",width:screenWidth,height:screenHeight}}>
            {(expand)&&
            <TouchableOpacity style={[styles.congrat,{backgroundColor:newColor,width:screenWidth,height:screenHeight,zIndex:1}]}  onPress={() => {setExpand(!expand),dispatch({type: 'hideFruit'}), console.log(newColor)}}>
            </TouchableOpacity>}
            
            {(showFruit)&&
            <TouchableOpacity style={{position:"absolute",right:screenWidth/2,zIndex:10}} onPress={() => {setExpand(!expand);}}>
                
                <Image style={styles.fruit} source={require('./images/orangefruit.png')} />
            </TouchableOpacity>}
        </View>
        
    )

};

const styles = StyleSheet.create({
    fruit:{
      position:"absolute",
      width:90,
      height:90,
      top:300,
    },
    congrat:{
        opacity: 0.7,
        position:"absolute",
        top:0,
    }
  });
export default Fruit;