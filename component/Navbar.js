import React, {Component} from 'react'
import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight
} from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

export default class Navbar extends Component {
    render(){
        return (
            <View style={styles.containerNavbar}>
                <TouchableHighlight onPress={this.props.showMenu}>
                    <Icon name={this.props.icon} size={25} color="#fff" />
                </TouchableHighlight>
                <Text style={styles.navbarTitle}>New Recipes</Text>
                <Icon name="search" size={25} color="#fff" />
                <Icon name="heart" size={25} color="#fff" />
                <Icon name="ellipsis-v" size={25} color="#fff" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerNavbar: {
        backgroundColor: '#555566',
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        justifyContent: 'space-between',
        paddingTop: 25
    },
    navbarTitle: {
        fontSize: 20,
        color: '#fff'
    }
})