import React, { useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import SwitchSelector from "react-native-switch-selector";
import { useData, useDataDispatch } from './DataContext.js';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


import {
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  View, 
  Text,
  Button, 
  Switch,
  Dimensions
} from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight= Dimensions.get('window').height;

const Setting_Page = () => {
  const {settings: {theme, language, color}, colors} = useData();
  const dispatch = useDataDispatch();
  
  const styles = StyleSheet.create({
    input: {
      height: 20,
      width: 180,
      margin: 12,
      padding: 10,
    },
    // ...colors.reduce(
    //   (a, c) => ({
    //     ...a,
    //     ['roundButton' + c.id]: {
    //       marginLeft:20,
    //       width: 40,
    //       height: 40,
    //       justifyContent: 'center',
    //       alignItems: 'center',
    //       padding: 10,
    //       borderRadius: 100,
    //       backgroundColor: c.value,
    //     }
    //   }, {})
    // ),
    roundButton: {
      marginLeft:20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
    },
    container_darkmode: {
      alignItems: "center",
      flexDirection: "row",
    },
    container_dark: {
      marginTop:10,
      backgroundColor: "#999",
      flex: 0,
      alignItems: "center",
      flexDirection: "column",
    },
    container: {
      marginTop:100,
      backgroundColor: "#DDD",
      flex: 1,
      alignItems: "center",
      flexDirection: "row",
    },
    container_col: {
      // marginTop:100,
      // backgroundColor: "#00FF00",
      flex: 0,
      alignItems: "center",
      flexDirection: "column",
    },
  });

  return (
    <View>
      <View style={{
        alignItems: 'right', 
        justifyContent: 'center', 
        marginLeft :20,
        marginTop : 20,

        }}>
          <View style = {{flexDirection:'row', alignItems:'center'}}>
          <Ionicons name="person-circle-outline" size={40} color="black" />
          
            <TouchableOpacity onPress={()=>{dispatch({
                  type: 'Login'
                })
                }}>

              <Text style={{lineHeight: 30, fontSize: 30, marginLeft: 10}}>
                登入帳號
                </Text>

            </TouchableOpacity>

          </View>

          <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20,marginTop:30}}>
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
            
            <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          </View>

          <View style={[styles.container_darkmode,{marginTop:30}]} >
            <Ionicons name="moon" size={30} color="black" />
            <Text style={{ fontSize: 30, marginLeft:10}}>暗色主題</Text>
            
            <Switch
              style = {{top:0,left:screenWidth*0.7, position:'absolute'}}
              trackColor={{false: '#767577', true: '#07B'}}
              thumbColor={'#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              // value={on}
              // onValueChange={handle}
              value={theme === 'dark'}
              onValueChange={() => {
                dispatch({
                  type: 'toggleTheme'
                })
              }}
            />

            
          </View>

          <View style={[styles['container_' + theme],{marginTop:30,alignItems: "center", flexDirection: "row",}]}>
            <Entypo name="globe" size={30} color="black" />
            <Text style={{ fontSize: 30,marginLeft:10}}>語言</Text>
            <View style = {{top:0,left:screenWidth*0.5, position:'absolute'}}>
              <SelectDropdown 
                  // Todo 
                  data={['中文', 'English']}
                  buttonStyle={{flex: 1,
                    height: 40,
                    width: 160,
                    backgroundColor: '#FFF',
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#444',
                  }}

                  onSelect={selectedItem => {
                    dispatch({ 
                      type : 'setLanguage',
                      language : selectedItem === 'English' ? 'english' :'chinese'
                    })
                    console.log("select language")
                    console.log(selectedItem)
                    
                  }}
                  renderDropdownIcon={isOpened => {
                    return  <Ionicons name={isOpened ? 'chevron-up' : 'chevron-down'} size={24} color="black" />;
                  }}
    

                  defaultButtonText={language === 'english' ? 'English' : '中文'}

                  buttonTextAfterSelection={selectedItem => {
                    return selectedItem
                  }}
              />

            </View>

          </View>

          <View style={[styles.container_col,{marginTop:30}]}>
            <View style = {{alignItems: "center",flexDirection: "row"}}>
              <Ionicons name="color-fill" size={30} color="black" />
              <Text style={{ fontSize: 30,marginLeft:10 }}>主題色</Text>
            </View>

            <View style={{alignItems: "center",flexDirection: "row", marginTop:10}}>
              {
                colors.map(c => (
                  c.unlocked &&
                  <TouchableOpacity
                    key={c.color}
                      onPress={() =>
                        dispatch({
                          type : 'setColor',
                          color : c.color,
                        })
                      }
                      style={[styles.roundButton, {backgroundColor: c.color}]}>
                  </TouchableOpacity>
                ))
              }
              
            </View>
          </View>

          <View style={{marginTop:30,alignItems: "center", flexDirection: "row",}}>
            <Ionicons name="arrow-redo" size={30} color="black" />
            <Text style={{fontSize: 30,marginLeft:10}}>分享給好友</Text>

          </View>

          <View style={{marginTop:30,alignItems: "center", flexDirection: "row",}}>
            <FontAwesome name="thumbs-up" size={30} color="black" />
            <Text style={{fontSize: 30,marginLeft:10}}>幫我們評分</Text>

          </View>
      </View>
    </View>
  );
};

export default Setting_Page;