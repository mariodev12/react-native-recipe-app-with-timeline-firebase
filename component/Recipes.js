import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    ListView,
    TouchableHighlight,
    Image,
    Dimensions
} from 'react-native'

import Navbar from './Navbar'
import Helpers from '../lib/helpers'
import * as firebase from 'firebase'

const {width, height} = Dimensions.get('window')
export default class Recipes extends Component {
    constructor(props){
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            uid: '',
            dataSource: ds.cloneWithRows([]),
            rawRecipes: ''
        }
    }

    
    componentWillMount() {
        try {
            let user = firebase.auth().currentUser
            this.setState({
                uid: user.uid
            })
            Helpers.getAllRecipes((recipes) => {
                if(recipes){
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(recipes),
                        rawRecipes: recipes
                    })
                }
            })
        } catch(error){
            console.log(error)
        }
    }

    closeView(){
        this.props.navigator.pop()
    }

    renderRow(rowData){
        const img = rowData.image
        return (
        <TouchableHighlight style={styles.containerCell}

        >
            <View>
                <Image 
                    style={{width: width, height: 180}}
                    source={{uri: img}}
                />
                <View style={styles.footerContainer}>
                    <View
                        style={styles.imageUser}
                    >
                        <Image 
                            style={styles.imageAvatar}
                            source={{uri: rowData.userPhoto}}
                        />
                    </View>
                    <View style={styles.footerTextContainer}>
                        <Text style={styles.text}>{rowData.food}</Text>
                        <Text style={[styles.text, styles.textTitle]}>{rowData.title}</Text>
                        <Text style={[styles.text, styles.textBy]}>By {rowData.userName}</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
        )
    }

    render(){
        return (
            <View style={styles.container}>
                <Navbar icon="times" showMenu={this.closeView.bind(this)}/>
                <ListView 
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    style={{flex: 1}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    footerContainer: {
       flexDirection: 'row',
       paddingHorizontal: 10,
       paddingVertical: 10,
       backgroundColor: '#555566' 
    },
    imageAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 5
    },
    listContainer: {
        marginHorizontal: 10
    },
    text: {
        color: '#fff'
    },
    containerCell: {
        marginBottom: 10
    },
    textTitle: {
        fontSize: 13
    },
    textBy: {
        fontSize: 12
    },
    textMenu: {
        fontSize: 20,
        color: '#fff'
    }
})
