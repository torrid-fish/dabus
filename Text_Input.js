import React from 'react';
import {SafeAreaView,ScrollView, StyleSheet, TextInput,View} from 'react-native';



const TextInputDestination = (props) => {
  const [text, setText] = React.useState('');
  const findDestination = () => {
    if (props.busStops.find(text))
      props.addRecentSearch(text);
  }

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

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 180,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default TextInputDestination;