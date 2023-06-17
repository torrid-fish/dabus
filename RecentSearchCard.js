import React from 'react';
import {SafeAreaView,TouchableOpacity, StyleSheet, TextInput,Text, View, TouchableWithoutFeedback} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Feather } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import { useState  } from 'react'; 
import {useData, useDataDispatch} from './DataContext.js'



const RecentSearchCard = props => {
  const {favorite} = useData();
  const dispatch = useDataDispatch();

  const [isFav, setIsFav] = useState(favorite.includes(props.name));

  return (
    <View>
      <View style={styles.container}>
        <Text style = {styles.busstop}>{props.name}</Text>
        
        <TouchableOpacity 
          onPress={() => {
            dispatch({
              type: isFav ? 'removeFavorite' : 'addFavorite',
              name : props.name
            });
            setIsFav(!isFav);
          }}
          style = {styles.roundButton}>
          {
            isFav 
            ? <FontAwesome name="star" size={24} color="yellow"/> 
            : <Feather name="star" size={24} color="black"/>
          }
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:30,
    marginBottom:20,
    paddingBottom:20,
    backgroundColor: "#DDD",
    alignItems: "center",
    flexDirection: "row",
  },
  roundButton: {
    marginLeft:330,
    position : "absolute",
  },

  busstop:{
    marginLeft:20,
    fontSize:20,
    backgroundColor: '#DDD',
    paddingTop:10,
  }
});

export default RecentSearchCard;