import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView,TouchableOpacity, TouchableHighlight,Dimensions, } from 'react-native';
import { useState } from 'react';
import { Icon } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons'; 
import DropDownPicker from 'react-native-dropdown-picker';
import { SelectList } from 'react-native-dropdown-select-list'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useRef } from 'react';
import {useData, useDataDispatch} from './DataContext.js'
import { MaterialCommunityIcons } from '@expo/vector-icons';


const FavoriteCard = props => {
    // const {favorite} = useData();
    const dispatch = useDataDispatch();
    const [del, setDel] = useState(false);
    const [search, setsearch] = useState(false);
  
    const handleSearchPress = () => {
      //
    };
    const handleDelPress = () => {
      // console.log(props)
      dispatch({
        type: 'removeFavorite',
        name : props.name
      })
    };
    return(
      <TouchableOpacity onPress={handleSearchPress} style={Fav_styles.fav}>
        <View style={Fav_styles.bus_and_del}>
          <View style={Fav_styles.bus}>

            <Text style={Fav_styles.text1}>前往: <Text style={Fav_styles.text2}>{props.name}</Text></Text>
            
            <Text style={Fav_styles.text3}>{props.bus_name}
              <Text style={Fav_styles.text4}> 離抵達 </Text> 
              <Text style={Fav_styles.text5}>{props.depart_stop}</Text>
              <Text style={Fav_styles.text4}>還剩</Text>
              <Text style={Fav_styles.text6}> {props.arrive_time} </Text>
              <Text style={Fav_styles.text4}>分鐘</Text>
            </Text>

          </View>
          
          <TouchableOpacity onPress={handleDelPress} style={{ marginLeft:40}} >
              <MaterialCommunityIcons name="star-off-outline" size={40} color="black" />
            <Text style={{fontSize:10} } >取消最愛</Text>
          </TouchableOpacity>
        </View>   
      </TouchableOpacity>
    )
  
  }
  
  const sceenwidth = Dimensions.get('window').width;

  const Fav_styles = StyleSheet.create({
    fav: {
      width: sceenwidth - 40,
      justifyContent: 'center',
      marginRight:20,
      marginLeft:20,
      marginTop:20,
      paddingTop:10,
      paddingBottom:10,
      // backgroundColor:'#D9D9D9',
      borderRadius:10,
      borderWidth: 1,
      borderColor: 'black',
      opacity:0.8
    },
    bus_and_del:{
      marginRight:0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text1:{
      marginLeft:0,
      marginRight:40,
      marginBottom:10,
      marginBottom:0,
      fontSize:18,
      color:"#000000",
    },
    text2:{
      marginLeft:0,
      marginRight:80,
      marginBottom:10,
      fontSize:22,
      color:"#0072B2",
    },
    text3:{
      marginLeft:0,
      marginRight:0,
      marginTop:5,
      marginBottom:0,
      fontSize:16,
      color:"#0072B2",
    },
    text4:{
      marginLeft:0,
      marginRight:40,
      marginBottom:0,
      fontSize:16,
      color:"#000000",
    },
    text5:{
      marginLeft:40,
      marginRight:40,
      marginBottom:0,
      fontSize:16,
      color:"#0072B2",
    },
    text6:{
      marginLeft:40,
      marginRight:40,
      marginBottom:0,
      fontSize:16,
      color:"#000000",
    },
    del:{
      margin:0,
      alignItems: 'center',
      justifyContent: 'center',
      marginButton:20,
    },
    del_icon:{
  
    },
    del_text:{
  
    },
    bus:{
      marginLeft:0,
      marginRight:40,
    }
  });
  

export default FavoriteCard;