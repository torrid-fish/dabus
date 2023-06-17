import React, {useState} from 'react';
import { Text, StyleSheet, View} from 'react-native';
import { CheckBox } from '@react-native-community/checkbox';

const Checkbox = () => {
  const [isFromSelected, setFromSelection] = useState(false);
  const [isToSelected, setToSelection] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={isFromSelected}
          onValueChange={setFromSelection}
          style={styles.checkbox}
        />
        <CheckBox
          value={isToSelected}
          onValueChange={setToSelection}
          style={styles.checkbox}
        />

        <Text style={styles.label}>Do you like React Native?</Text>
      </View>
      <Text>Is CheckBox selected: {isFromSelected && isToSelected ? '👍' : '👎'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});

export default Checkbox;