import React, {useState, useEffect, createContext, useContext, useReducer} from 'react';
import { View, Text, Button, Switch,ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenStackHeaderBackButtonImage } from 'react-native-screens';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TextInputDestination from './Text_Input.js';
import Setting_Page from './Setting_Page.js';
import BusDetailContainer from './BusDetailContainer.js';
import RecentSearchList from './RecentSearchList.js';
import { useData, useDataDispatch, DataProvider } from './DataContext.js'; 
import ReminderList from './ReminderList.js';
import FavoriteList from './FavoriteList.js';
import Checkbox from './CheckBox.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Deep_stack = createNativeStackNavigator();
const treePercents = use

function Root(){
  return(
    <Tab.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
        <Tab.Screen name="Reminder" component={ReminderScreen} />

        <Tab.Screen name="Main" component={MainFlow} />

        <Tab.Screen name="Favorite" component={FavoriteScreen}/>
    </Tab.Navigator> 
  );
}

function MainFlow({navigation}){
  const {settings:{language}} = useData();
  const homeName = language === 'chinese' ? '首頁' : 'Home';
  return(
    <Stack.Navigator initialRouteName = {homeName}>
        <Stack.Screen name = {homeName} component={Home} />
        <Stack.Screen name = "Search" component={Search}/>
        <Stack.Screen name = "BusDtail" component={BusDetail}/>

    </Stack.Navigator>
  )
}

function Home({navigation}){
  const {settings:{color}} = useData();
  return(
    <View>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Go to Search" onPress={() => navigation.navigate('Search')} />
      </View>
      <Text>{color}</Text>
      {/* <Checkbox/> */}
      
      
    </View>
  )
}

function Search({navigation}){
  const busStops = {123: false, 345: false, 567: false};
  return(
    <View>
      {/* <ScrollView style={{height: 300}} keyboardShouldPersistTaps = 'always'> */}

        <View  style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TextInputDestination busStops={busStops}/>

        </View>

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Button title="Go to BusDtail" onPress={() => navigation.navigate('BusDtail')} />
        </View>
        <RecentSearchList/>

      {/* </ScrollView> */}
    </View>
  )
}

function BusDetail({navigation}) {
  return (
    <View style={{ justifyContent: 'center' }}>
      
      <BusDetailContainer/>
          
    </View>

  );
}

function ReminderScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Reminder Screen</Text>

      <ReminderList/>
      

    </View>
  );
}

function FavoriteScreen({navigation}){
  return(
    <View style={{ flex: 1, alignItems: 'center',  }}>
      <Text>Favorite Screen</Text>
      
      <FavoriteList/>
    </View>
  );
}

const headerOptions_Root = ({ route, navigation }) => ({
  headerTintColor: "black",
  headerTitleStyle: { alignSelf: "center", fontSize: 16 },
  
  headerRight: () => (
    <Button 
      title="Setting "
      onPress={() => navigation.navigate("Setting")}
    />
  ),
  headerLeft: () => (
    <Text></Text>
  ),
});

const headerOptions_Setting = ({ route, navigation }) => ({
  headerTintColor: "black",
  headerTitleStyle: { alignSelf: "center", fontSize: 16 },
  
  headerRight: () => (
    <Button 
      title="Back " 
      onPress={() => navigation.goBack()}
      // onPress={() => console.log(navigation)}
    />
  ),
  headerLeft: () => (
    <Text></Text>
  ), 
});

function App() {
  return (
    <DataProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Root">

          <Stack.Screen name="Setting" component={Setting_Page} options={headerOptions_Setting}  /> 

          <Stack.Screen name="Root" component={Root} options={headerOptions_Root} /> 

        </Stack.Navigator>
      </NavigationContainer>
    </DataProvider>
    // The name must be unique
  );
} 

export default App;