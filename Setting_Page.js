import React, { useState } from 'react';
import SelectDropdown from 'react-native-select-dropdown';
import SwitchSelector from "react-native-switch-selector";
import { useData, useDataDispatch } from './DataContext.js';

import {
  SafeAreaView, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  View, 
  Text,
  Button, 
  Switch
} from 'react-native';

const Setting_Page = () => {
  const {settings: {theme, language, color}} = useData();
  const dispatch = useDataDispatch();
  
  // need to be dynamic later
  const colors = [
    {id: 0, value: '#7BF'},
    {id: 1, value: '#8F7'},
    {id: 2, value: '#FB7'}
  ];

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
    roundButton0: {
      marginLeft:20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: '#7BF',
    },
    roundButton1: {
      marginLeft:20,
      // marginTop: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: '#BF7',
    }, 
    roundButton2: {
      marginLeft:20,
      // marginTop: 20,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: '#FB7',
    }, 
    container_darkmode: {
      marginTop:10,
      backgroundColor: "#DDD",
      flex: 0,
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
      flexDirection: "row",
    },
  });

  return (
    <View>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{lineHeight: 30, fontSize: 20,}}>登入帳號</Text>

          <View style={styles.container_darkmode} >
            <Text style={{lineHeight: 30, fontSize: 20,}}>暗色主題</Text>
            
            <Switch
              style = {{marginLeft:40}}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
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

          <View style={styles['container_' + theme]}>
            <Text style={{ fontSize: 20,}}>語言</Text>
            
            <SelectDropdown 
                data={['中文', 'English']}

                onSelect={selectedItem => {
                  dispatch({ 
                    type : 'setLanguage',
                    language : selectedItem === 'English' ? 'english' :'chinese'
                  })
                  console.log("select language")
                  console.log(selectedItem)
                  
                }}

                defaultButtonText={language === 'english' ? 'English' : '中文'}

                buttonTextAfterSelection={selectedItem => {
                  return selectedItem
                }}
            />

          </View>

          <View style={styles.container_col}>
            <Text style={{ fontSize: 20,}}>主題色</Text>
            
            <View style={styles['container_' + theme]}>
              {
                colors.map(c => 
                  <TouchableOpacity
                    key={c.id}
                      onPress={() =>
                        dispatch({
                          type : 'setColor',
                          color : c.value,
                        })
                      }
                      style={styles['roundButton' + c.id]}>
                      <Text>{c.value}</Text>
                  </TouchableOpacity>
                )
              }
              
            </View>
          </View>
          
          <Text style={{lineHeight: 30, fontSize: 20,}}>分享給好友</Text>
          <Text style={{lineHeight: 40, fontSize: 20,}}>幫我們評分</Text>
      </View>
    </View>
  );
};

export default Setting_Page;