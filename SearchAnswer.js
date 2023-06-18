import React, {useState} from 'react';

import {
    SafeAreaView, 
    StyleSheet,
    ScrollView,
    TouchableOpacity, 
    TextInput, 
    View, 
    Text,
    Button,
    Switch
} from 'react-native';

import RecentSearchCard from './RecentSearchCard';

import {useData} from './DataContext.js'

const SearchAnswer = ({navigation}) => {
    const {reminder} = useData();
    return (
        <SafeAreaView style={styles.container}>
             <RecentSearchCard name='新竹火車站' navigation = {navigation}/>
        </SafeAreaView>
    );
  };
  
const styles = StyleSheet.create({
    container :{
        justifyContent :'center',
        // alignContent :'center',
        // marginRight:10,
        
    },
    scrollContainer : {
        // marginLeft :10,
        marginright:10,
        
    },

});

export default SearchAnswer;