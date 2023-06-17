import React, {useState} from 'react';

import {SafeAreaView, StyleSheet,ScrollView, TouchableOpacity, TextInput, View, Text,Button,Switch} from 'react-native';
import RecentSearchCard from './RecentSearchCard';
import {useData} from './DataContext.js'


const RecentSearchList = () => {
  const {recentlySearched} = useData();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollContainer}>
                {recentlySearched.map(rec => <RecentSearchCard name={rec}/>)}
            </ScrollView>
        </SafeAreaView>
    );
  };
  
const styles = StyleSheet.create({


});

export default RecentSearchList;