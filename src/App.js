import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        console.log("Render Done Yeah.");
        return (
            <View style={styles.bg}> 
                <View style={styles.block1}>
                    <Text style={styles.text}>Hello World! React</Text>
                </View>
            </View>
        );
    }
}

// No CSS, use styles to adjust.
const styles = StyleSheet.create({
    bg: {
        flex: 1
    },
    block1: {
        flex: 1,
        backgroundColor: "rgb(120, 100, 120)",
        alignItems: 'center', // Horizontal align
        justifyContent: 'center' // Vertical align
    },
    text: {
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center'
    }
});