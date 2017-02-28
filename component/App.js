import React, {Component} from 'react'
import {
    Text,
    StyleSheet,
    View,
    ListView,
    TouchableHighlight,
    Dimensions,
    Image,
    Animated,
    TextInput
} from 'react-native'

import Navbar from './Navbar'
import * as firebase from 'firebase'
import Helpers from '../lib/helpers'

const {width, height} = Dimensions.get('window')

export default class App extends Component {
    constructor(props){
        super(props)
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            isLoaded: false,
            isOpenMenu: false,
            dataSource: ds.cloneWithRows([]),
            rotateY: new Animated.Value(0),
            translateX: new Animated.Value(width),
            menuAnimation: new Animated.Value(0),
            text: '',
            uid: '',
            avatarUrl: '',
            userName: '',
            name: '',
            url: ''
        }
    }

    async componentWillMount() {
        try {
            let user = await firebase.auth().currentUser
            Helpers.getImageUrl(user.uid, (imageUrl) => {
                this.setState({
                    avatarUrl: imageUrl
                })
            })
            Helpers.getName(user.uid, (name) => {
                this.setState({
                    userName: name
                })
            })
            Helpers.getUserRecipes(user.uid, (recipes) => {
                if(recipes){
                    this.setState({
                        name: recipes.name,
                        url: recipes.url,
                        recipes: recipes.recipes,
                        dataSource: this.state.dataSource.cloneWithRows(recipes.recipes)
                    })
                }
            })
            this.setState({
                uid: user.uid
            })
        } catch(error){
            console.log(error)
        }
    }

    showMenu(){
        if(this.state.isOpenMenu){
            this.setState({isOpenMenu: false})
            Animated.parallel([
                Animated.timing(
                    this.state.translateX, {
                        toValue: width
                    }
                ),
                Animated.timing(
                    this.state.rotateY, {
                        toValue: 0
                    }
                )
            ]).start()
        } else {
            this.setState({isOpenMenu: true})
            Animated.parallel([
                Animated.timing(
                    this.state.translateX, {
                        toValue: width * 0.60
                    }
                ),
                Animated.timing(
                    this.state.rotateY, {
                        toValue: 1
                    }
                ),
                Animated.timing(
                    this.state.menuAnimation, {
                        toValue: 1,
                        duration: 800
                    }
                )
            ]).start()
        }
    }

    closeMenu(){
        this.setState({isOpenMenu: false})
        Animated.parallel([
            Animated.timing(
                this.state.translateX, {
                    toValue: width
                }
            ),
            Animated.timing(
                this.state.rotateY, {
                    toValue: 0
                }
            ),
            Animated.timing(
                this.state.menuAnimation, {
                    toValue: 0,
                    duration: 300
                }
            )
        ]).start()
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
                                source={{uri: this.state.url}}
                            />
                        </View>
                        <View style={styles.footerTextContainer}>
                            <Text style={styles.text}>{rowData.food}</Text>
                            <Text style={[styles.text, styles.textTitle]}>{rowData.title}</Text>
                            <Text style={[styles.text, styles.textBy]}>By {this.state.name}</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
    filterSearch(text){
        const newData = data.filter(function(item){
            const itemData = item.food.toUpperCase()
            const textData = text.toUpperCase()
            return itemData.indexOf(textData) > -1
        })
        this.setState({
            dataSource: this.state.dataSource.cloneWithRows(newData),
            text: text
        })
    }
    async logout(){
        try {
            await firebase.auth().signOut()
            this.props.navigator.push({
                id: 'Login'
            })
        } catch(error){
            console.log(error)
        }
    }
    showProfile(){
        this.props.navigator.push({
            id: 'Profile'
        })
    }
    showNewRecipes(){
        this.props.navigator.push({
            id: 'New Recipes'
        })
    }
    showRecipes(){
        this.props.navigator.push({
            id: 'Recipes'
        })
    }
    render(){
        console.log(this.state.avatarUrl ? this.state.avatarUrl : null)
        return (
            <View style={styles.container}>
                <Animated.View
                    style={[styles.content, {
                        width: width,
                        backgroundColor: 'gray',
                        flex: 1,
                        transform: [
                            {
                                perspective: 450
                            },
                            {
                                translateX: this.state.translateX.interpolate({
                                    inputRange: [0, width],
                                    outputRange: [width, 0]
                                })
                            },
                            {
                                rotateY: this.state.rotateY.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '-10deg']
                                })
                            }
                        ]
                    }]}
                >
                    {this.state.isOpenMenu ? <Navbar icon="times" showMenu={this.closeMenu.bind(this)}/> : <Navbar icon="bars" showMenu={this.showMenu.bind(this)}/>}
                    <TextInput 
                        style={styles.textInput}
                        onChangeText={(text) => this.filterSearch(text)}
                        value={this.state.text}
                    />
                    <ListView 
                        enableEmptySections={true}
                        style={styles.listContainer}
                        renderRow={this.renderRow.bind(this)}
                        dataSource={this.state.dataSource}
                    />
                </Animated.View>
                <Animated.View
                    style={[styles.menu, {
                        opacity: this.state.menuAnimation,
                        position: 'absolute',
                        width: 140,
                        left: 0,
                        top: 100,
                        backgroundColor: 'transparent'
                    }]}
                >
                    {this.state.avatarUrl ? <Image 
                        style={{width: 100, height: 100, borderRadius: 50}}
                        source={{uri: this.state.avatarUrl}}
                    />: null}
                    <Text>{this.state.userName ? this.state.userName : ''}</Text>
                    <Text style={styles.textMenu}>Home</Text>
                    <TouchableHighlight onPress={this.showNewRecipes.bind(this)}>
                        <Text style={styles.textMenu}>New Recipes</Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={this.showRecipes.bind(this)}>
                        <Text style={styles.textMenu}>Recipes</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={this.showProfile.bind(this)}
                    >
                        <Text style={styles.textMenu}>Profile</Text>
                    </TouchableHighlight>
                    <Text style={styles.textMenu}>Settings</Text>
                    <TouchableHighlight
                        onPress={this.logout.bind(this)}
                    >
                        <Text style={styles.textMenu}>Logout</Text>
                    </TouchableHighlight>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#555566'
    },
    textInput: {
        height: 30,
        borderWidth: 1,
        borderColor: '#cecece',
        marginBottom: 10,
        marginHorizontal: 10
    },
    content: {
        zIndex: 1
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