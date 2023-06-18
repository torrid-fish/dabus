import React, {useState} from 'react';
import {SafeAreaView,ScrollView, StyleSheet, TextInput,View} from 'react-native';
import {useData, useDataDispatch} from './DataContext.js'

const TextInputDestination = (props) => {
  const {settings: {color}} = useData();

  const [text, setText] = useState('');
  const findDestination = () => {
    if (props.busStops.find(text))
      props.addRecentSearch(text);
  }
  
  const styles = StyleSheet.create({
    input: {
      backgroundColor: color, 
      width:344, 
      height:44, 
      margin: 20, 
      borderRadius: 10, 
      opacity: 0.6,
      justifyContent :'left',
      flexDirection:'row',
      alignItems: 'center',
    },
  });
  
  return (
    <SafeAreaView>
      {/* <ScrollView style={{height: 10}} keyboardShouldPersistTaps = {true}> */}
        <TextInput
          style={styles.input}
          onChangeText={setText}
          placeholder="Go To ..."
          keyboardType="default"
          autoFocus={true}
          blurOnSubmit={false}
          value={text}
          onSubmitEditing={findDestination}
        />

      {/* </ScrollView> */}

        

    </SafeAreaView>
  );
};


export default TextInputDestination;