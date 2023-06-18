import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView,TouchableOpacity, TouchableHighlight,Dimensions, } from 'react-native';
import { useState, useRef } from 'react';
import { Icon } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AntDesign } from '@expo/vector-icons'; 
import { SelectList } from 'react-native-dropdown-select-list'
import { MaterialIcons } from '@expo/vector-icons'; 
import {useData, useDataDispatch} from './DataContext.js'

const Reminder = props => {
  const {settings:{color}} = useData();
  const dispatch = useDataDispatch();

  const [expanded, setExpanded] = useState(false);

  const handleButtonPress = () => {
    setExpanded(!expanded);
  };

  const data = ['1','3','5','10','15','20','30',]

  const hour_data = [...Array(12).keys()].map(e=>''+e);

  const minute_data = [...Array(60).keys()].map(e=>''+e);

  const ampm_data = ['am', 'pm'];

  const chineseDay = ['日','一','二','三','四','五','六']

  const sceenwidth = Dimensions.get('window').width;

  const Noti_styles = StyleSheet.create({
    toptext1:{
      marginLeft:15,
      marginRight:50,
      marginBottom:10,
      marginTop:8,
      fontSize:12,
      color:"#858484",
    },
    toptext2:{
      marginLeft:0,
      marginRight:80,
      marginBottom:0,
      fontSize:22,
      color:"#0072B2",
    },
    toptext3:{
      marginLeft:15,
      marginRight:50,
      marginBottom:10,
      marginTop:10,
      fontSize:20,
      color:"#D53737",
    },
    toptext4:{
      marginLeft:0,
      marginRight:0,
      marginBottom:0,
      fontSize:18,
      color:"black",
    },
    toptext5:{
      marginLeft:15,
      marginRight:50,
      marginBottom:20,
      marginTop:20,
      fontSize:32,
      color:"#D53737",
    },
    toptext6:{
      fontSize:16,
      top:0,
      color:"black",
      position:'relative',
      justifyContent:'space-between',
    },
    horizontalLine: {
      borderBottomColor: "black",
      backgroundColor: "black",
      borderBottomWidth: 1,
      width: 315,
      color: "black",
      marginLeft:15,
      marginRight:15,
      marginBottom:20,
      justifyContent: 'center'
    },
    extend_icon: {
      color: "#858484",
      marginLeft:160,
      marginRight:150,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
    },
    time_select:{
      justifyContent: 'center',
      marginTop:30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position:'absolute'
    },
    noti:{
      width: sceenwidth-40,
      justifyContent: 'center',
      marginRight:20,
      marginLeft:20,
      marginTop:10,
      paddingTop:10,
      paddingBottom:10,
      backgroundColor:'#D9D9D9',
      borderRadius:10,
      borderWidth: 1,
      borderColor: '#fff'
    },
    time:{
      marginLeft:15,
      marginRight:50,
      marginBottom:20,
      flexDirection: 'row',
      alignItems: 'center',
      position:'relative',
      maxWidth: 200,
    },
    rpt_alarm_text:{
      marginLeft:15,
      marginRight:50,
      fontSize:16,
      color:"black",
    },
    rpt_alarm_btn:{
      marginLeft:0,
      marginRight:7,
      borderColor:'black',
      fontSize:16,
      color:"white",
      position:'relative',
      flexDirection:'row',
      width: 40,
      height: 40,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rpt_alarm_week:{
      marginLeft:10,
      marginRight:50,
      flexDirection: 'row',
      justifyContent: 'row',
      paddingTop:10,
      paddingBottom:10,
    },
    rpt_alarm_day:{
      fontSize:22,
      color:"white",
    },
    repeat_time_select:{
      justifyContent: 'center',
      marginTop:20,
      marginBottom:15,
      marginLeft:15,
      marginRight:5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position:'relative'
    },
    hour_select:{
      justifyContent: 'center',
      marginTop:30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position:'absolute'
    },
    minute_select:{
      justifyContent: 'center',
      marginTop:30,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position:'absolute'
    },
    repeat_select_text:{
      fontSize:25,
      marginLeft:5,
      marginRight:5,
      position:"relative"
    },
    bus_and_del:{
      marginLeft:0,
      marginRight:15,
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position:'relative'
    },
    del:{
      margin:0,
      alignItems: 'center',
      justifyContent: 'center',
      marginButton:20,
    },
    del_icon:{
      margin:0,
    },
    del_text:{
      margin:0,
    }
  });
  return (
    <TouchableOpacity
      style={[Noti_styles.noti,{opacity:0.8}]}
      underlayColor='#fff'
    >
      <Text style={Noti_styles.toptext1}>前往: {props.to}</Text>
      <View style={Noti_styles.bus_and_del}>
        <View>
          <Text style={Noti_styles.toptext2}>{props.bus}
            <Text style={Noti_styles.toptext4}> 離抵達 </Text> 
          {props.from}</Text>
          <Text style={Noti_styles.toptext3}>還剩 
          <Text style={Noti_styles.toptext5}> {/*TODO*/'5'} </Text>
          分鐘</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => dispatch({
            type: 'removeReminder',
            id: props.id
          })} 
          style={Noti_styles.del} 
        >
          <MaterialIcons style={Noti_styles.del_icon} name="alarm-off" size={45} color="black" />
          <Text style={Noti_styles.del_text}>取消提醒</Text>
        </TouchableOpacity>
      </View>

      {expanded && ( 
        <View style={Noti_styles.horizontalLine} />
      )}
      {!expanded && (
        <TouchableOpacity onPress={handleButtonPress} >
          <AntDesign style={Noti_styles.extend_icon} name="down" size={24} color="black" />
        </TouchableOpacity>
      )}
      
      {expanded && (<>
        <View style={Noti_styles.time}>
          <Text style={Noti_styles.toptext6}>在公車抵達前 </Text>
          <SelectList 
            style={Noti_styles.time_select}
            setSelected={val => dispatch({
              type: 'setReminderBeforeTime',
              remind: val
            })} 
            data={data} 
            save="value"
            search={false}
            placeholder={'Time'}
            maxHeight={150}
            dropdownShown={false}
            defaultOption={{key: '1', value: '1'}}
            boxStyles={{width:70}}
            dropdownStyles={{width:70}}
          />
          <Text style={Noti_styles.toptext6}> 分鐘提醒</Text>
        </View>
      
        <View>
          <Text style={Noti_styles.rpt_alarm_text}>重複提醒：</Text>  
          <View style={Noti_styles.rpt_alarm_week}>{
            [...Array(7).keys()].map(day =>
              <TouchableOpacity 
                onPress={
                  () => {
                    dispatch({
                      type: 'toggleReminderRepeatDay',
                      id: props.id,
                      day: day
                    });
                  }
                } 
                style={[
                  Noti_styles.rpt_alarm_btn, 
                {backgroundColor: (props.repeat[day].on ? '#07B' : '#888')}
                ]}>
                  <Text style={Noti_styles.rpt_alarm_day}>{chineseDay[day]}</Text>
                </TouchableOpacity>
            )
          }</View>
          <View style={Noti_styles.repeat_time_select}>
            <SelectList 
              style={Noti_styles.hour_select}
              setSelected={val => dispatch({
                type: 'setReminderHour',
                hour: val
              })}
              data={hour_data} 
              save="value"
              search={false}
              placeholder={"00"}
              maxHeight={150}
              dropdownShown={false}
              defaultOption={{key: '00', value: '00'}}
              boxStyles={{width:65}}
              dropdownStyles={{width:65}}
            />
            <Text style={Noti_styles.repeat_select_text}> : </Text>
            <SelectList 
              style={Noti_styles.minute_select}
              setSelected={val => dispatch({
                type: 'setReminderMinute',
                minute: val
              })} 
              data={minute_data} 
              save="value"
              search={false} 
              placeholder={"00"}
              maxHeight={150}
              dropdownShown={false}
              defaultOption={{key: '00', value: '00'}}
              boxStyles={{width:65}}
              dropdownStyles={{width:65}}
            />
            <Text style={Noti_styles.repeat_select_text}></Text>
            <SelectList 
              style={Noti_styles.ampm_select}
              setSelected={val => {
                dispatch({
                  type: 'setReminderHour',
                  hour: val === 'am' 
                    ? props.hour % 12 
                    : props.hour % 12 + 12
                })
              }}
              data={ampm_data} 
              save="value"
              search={false}
              placeholder={"am"}
              maxHeight={150}
              dropdownShown={false}
              defaultOption={{key: 'am', value: 'am'}}
              boxStyles={{width:65,margin:0,}}
              dropdownStyles={{width:65}}
            />
            <Text style={[Noti_styles.repeat_select_text, {color:"red"}]}>  提醒</Text>
          </View>
        </View>
      
      <TouchableOpacity zIndex={0} onPress={handleButtonPress} >
        <AntDesign style={Noti_styles.extend_icon} name="up" size={24} color="black" />
      </TouchableOpacity>
      </>)}
    </TouchableOpacity>
  );
};

export default Reminder;