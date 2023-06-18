import React, {useState, useEffect, createContext, useContext, useReducer} from 'react';
import { View, Text, Button,StyleSheet,TouchableOpacity,Image, Switch,ScrollView,Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Header} from 'react-native-elements';

import TextInputDestination from './Text_Input.js';
import Setting_Page from './Setting_Page.js';
import BusDetailContainer from './BusDetailContainer.js';
import RecentSearchList from './RecentSearchList.js';
import { useData, useDataDispatch, DataProvider } from './DataContext.js'; 
import ReminderList from './ReminderList.js';
import FavoriteList from './FavoriteList.js';
import Checkbox from './CheckBox.js';
import Weather from './Weather.js';
import Fruit from './Fruits.js';
import { Feather } from '@expo/vector-icons';

import { Ionicons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Fontisto } from '@expo/vector-icons';

import { useTheme } from 'react-native-paper';
import MapView from 'react-native-maps';
import SearchAnswer from './SearchAnswer.js';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// const Tab = createBottomTabNavigator();
const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Deep_stack = createNativeStackNavigator();

function ProviderRoot(){
  const {settings: {color}} = useData();
  const headerOptions_Root = ({ route, navigation }) => ({
    headerStyle: {
      headerHeight: 104,
      backgroundColor :color,
    },
    headerTitleStyle: {
      fontSize: 0
    },
    headerRight: () => (
      <Ionicons 
        style={{zIndex:5, marginRight:10}}
        name="settings-sharp" 
        size={28} 
        color="#FFF"
        onPress={() => navigation.navigate("Setting")}
      />
    ),
    headerLeft: () => (
      <View style={{flex : 0}}> 
        <TouchableOpacity style = {{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          marginBottom:0,
          marginLeft:10, 
          width: 150}} onPress={() => navigation.navigate("Home")}>
          <MaterialCommunityIcons name="bus" size={40} color="#FFF" />
          <Text style = {{fontSize: 24,fontWeight: "bold",color: "#FFF"}}> Dabus</Text>
        </TouchableOpacity>

      </View>
    ),
  });

  const headerOptions_Setting = ({ route, navigation }) => ({
    headerStyle: {
      headerHeight: 104,
      backgroundColor :color,
    },
    headerTitleStyle: {
      fontSize: 0
    },
    headerRight: () => (
      <Ionicons onPress={() => navigation.goBack()} name="home-outline" size={30} color="white" />
      
    ),
    headerLeft: () => (
      <View style={{flex : 0}}> 
        <TouchableOpacity style = {{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          marginBottom:0,
          marginLeft:10, 
          width: 150}} onPress={() => navigation.navigate("Home")}>
          <MaterialCommunityIcons name="bus" size={40} color="#FFF" />
          <Text style = {{fontSize: 24,fontWeight: "bold",color: "#FFF"}}> Dabus</Text>
        </TouchableOpacity>

      </View>
    ), 

  }); 
  return(
    <Stack.Navigator screenOptions={{ headerShown: true }} initialRouteName = 'Root'>
        <Stack.Screen name="Setting" component={Setting_Page} options={headerOptions_Setting}  /> 

        <Stack.Screen name="Root" component={Root} options={headerOptions_Root} /> 
    </Stack.Navigator> 
  );
}

function Root(){
  const {settings: {color}} = useData();
  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent";
  const currentscreen = 0;

  return(
    <Tab.Navigator 
      barStyle={{ backgroundColor: color  }}
      activeColor="#f0edf6"
      inactiveColor="#3e2465"

      // labeled = {true}
      shifting = {true}
      

      screenOptions={{ 
        headerShown: false,
        
        tabBarStyle:{
          backgroundColor: color,
          height:100,
        },
        tabBarItemStyle:{
          margin:5,
          border:30 
        }
      }} 
      initialRouteName="Main"
      // initialRouteName="Favorite"

      
      // tabBarActiveTintColor = "#559"
      // tabBarInactiveTintColo = "#333"
      >
        <Tab.Screen name="Favorite" component={FavoriteScreen}
        options={{ 
          tabBarIcon:() => <Feather name="star" size={30} color="white" />
        }} 
        />

        <Tab.Screen 
          name="Main"
          component={MainFlow} 
          options={{
            tabBarIcon: () => 
            <Ionicons name="home-outline" size={30} color="white" />
          }}
        />

        <Tab.Screen 
          name="Reminder" 
          component={ReminderScreen}  
          options={{ 
            tabBarIcon:() => <Ionicons name="notifications-outline" size={30} color="white"  />
          }} 
        />
    </Tab.Navigator> 
  );
}

function MainFlow({navigation}){
  const {settings:{language}} = useData();
  const homeName = language === 'chinese' ? '首頁' : 'Home';
  return(
    <Stack.Navigator initialRouteName = {homeName} screenOptions={{ headerShown: false}}>
        <Stack.Screen name = {homeName} component={Home} 
         tabBarIcon = {<Ionicons name="home-outline" size={24} color="black" />} />
        <Stack.Screen name = "Search" component={Search}/>
        <Stack.Screen name = "BusDtail" component={BusDetail}/>

    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  
  container: {
    flex: 0,
    backgroundColor: '#fff',
  },
  treePercentscss :{
    fontSize:70, 
    alignItems: 'center', 
    justifyContent: 'center',
    position : 'absolute',
    top:screenHeight*0.45,
    color:'#fff8'
  },
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    marginBottom:0,
  },

});

function Home({navigation}){
  const {settings:{color}} = useData();
  const {treePercents} = useData();
  const dispatch = useDataDispatch();
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  return(
    <View>
      {/* <Header
        ViewComponent={test}
        backgroundColor={color}
        leftComponent={<View style = {[styles.container,{marginLeft:10}]}>
        <MaterialCommunityIcons name="bus" size={36} color="#FFF" />
        <Text style = {{fontSize: 20,fontWeight: "bold",color: "#FFF"}}> Dabus</Text>
      </View>}
        rightComponent={<Ionicons 
          name="settings-sharp" 
          size={24} 
          color="#FFF"
          onPress={() => navigation.navigate("Setting")}
        />}
      />    */}

      <Image style={{zIndex:-1, width:screenWidth, position : "absolute",top:screenHeight*0.295, opacity:1}} source={require('./images/ground.png')} />

      <Image style={{zIndex:-1,position : "absolute",width:300,height:300,top:screenHeight*0.3,left:50, opacity:1}} source={require('./images/tree.png')} />

      <View style={{zIndex:2, alignItems: 'center', justifyContent: 'center'}}>
        <TouchableOpacity  style={{backgroundColor: color, width:344, height:44, margin: 20, borderRadius: 10, opacity: 0.6,justifyContent :'left',flexDirection:'row',alignItems: 'center',}} onPress={() => navigation.navigate('Search')}>
          <Fontisto style={{marginLeft:10}} name="search" size={24} color="white" />
          <Text style = {{fontSize: 20,fontWeight: "bold",color: "#FFF",marginLeft:10}}> 
            現在想去哪
          </Text>
        </TouchableOpacity>

        <Text 
          onPress={() => 
            dispatch({
              type :'addTreePercents',
              treePercents : 20
            })
          }
          style = {styles.treePercentscss}
        > 
          {treePercents} %
        </Text>

      </View>

      <Weather style={{zIndex:0,}} />

      <Fruit style={{zIndex:3,}}  /> 

    </View>
  )
}

function Search({navigation}){
  const busStops = {'123': false, '345': false, '567': false};
  return(
    <View>
      <ScrollView style={{height: 300}} keyboardShouldPersistTaps = 'always'>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TextInputDestination busStops={busStops}/>
        </View>

        {/* <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Button title="Go to BusDtail" onPress={() => navigation.navigate('BusDtail')} />
        </View> */}

        <ScrollView>
          <SearchAnswer navigation = {navigation}/>

          {/* dividing line */}
          <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20}}>
              <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          </View>
          
          <RecentSearchList navigation = {navigation}/>

        </ScrollView>
        

      </ScrollView>
    </View>
  )
}

function BusDetail({navigation}) {
  const {settings:{color}} = useData();

  return (
    <View >
        <View style={{position: 'absolute',top:0,left:0,zIndex:2}}>

          <TouchableOpacity  
            style={{
              backgroundColor: color, 
              
              width:344, height:44, margin: 20, borderRadius: 10, opacity: 0.6,justifyContent :'left',flexDirection:'row',alignItems: 'center',}} onPress={() => navigation.navigate('Search')} >
            <Fontisto style={{marginLeft:10}} name="search" size={24} color="white" />
            <Text style = {{fontSize: 20,fontWeight: "bold",color: "#FFF",marginLeft:10}}> 
              現在想去哪
            </Text>
          </TouchableOpacity>
        </View>

       <BusDetailContainer  />
          
    </View>

  );
}

function ReminderScreen({navigation}) {
  const {treePercents} = useData();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

      <ReminderList style={{ zIndex:2}}/>


      <Image style={{zIndex:-1, width:screenWidth, position : "absolute",top:screenHeight*0.295, opacity:0.5}} source={require('./images/ground.png')} />
      <Image style={{zIndex:-1,position : "absolute",width:300,height:300,top:screenHeight*0.3,left:50, opacity:0.5}} source={require('./images/tree.png')} />

      <Text style = {[styles.treePercentscss,{opacity:0.5,zIndex:-1}]}> {treePercents} %</Text>
      

    </View>
  );
}

function FavoriteScreen({navigation}){
  const {treePercents} = useData();

  return(
    <View style={{ flex: 1, alignItems: 'center',  }}>
      
      <FavoriteList style={{ zIndex:3}}/>
      

      <Image style={{zIndex:-1, width:screenWidth, position : "absolute",top:screenHeight*0.295, opacity:0.3}} source={require('./images/ground.png')} />
      <Image style={{zIndex:-1,position : "absolute",width:300,height:300,top:screenHeight*0.3,left:50, opacity:0.3}} source={require('./images/tree.png')} />

      <Text style = {[styles.treePercentscss,{opacity:0.5,zIndex:-1}]}> {treePercents} %</Text>
      
    </View>
  );
}
  
function App() {
  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ProviderRoot">
          <Stack.Screen name="ProviderRoot" component={ProviderRoot} options={{headerShown: false}}/> 
        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
  );
} 

export default App;