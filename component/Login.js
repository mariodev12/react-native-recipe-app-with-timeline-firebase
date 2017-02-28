import React, {Component} from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight
} from 'react-native'
import * as firebase from 'firebase'

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            email: '',
            password: '',
            response: ''
        }
        this.signUp = this.signUp.bind(this)
        this.login = this.login.bind(this)
    }
    async signUp() {
        try {
            await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
            this.setState({
                response: 'account created!'
            })
            setTimeout(() => {
                this.props.navigator.push({
                    id: 'Profile'
                })
            }, 1500)
        } catch(error){
            this.setState({
                response: error.toString()
            })
        }
    }
    async login() {
        try {
            await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            this.setState({
                response: 'user login in'
            })
            setTimeout(() => {
                this.props.navigator.push({
                    id: 'App'
                })
            })
        } catch(error){
            this.setState({
                response: error.toString()
            })
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <View style={styles.containerInputs}>
                    <TextInput
                        placeholderTextColor="grey"
                        placeholder="Email" 
                        style={styles.inputText}
                        onChangeText={(email) => this.setState({email})}
                    />
                    <TextInput 
                        placeholderTextColor="grey"
                        placeholder="Password"
                        style={styles.inputText}
                        password={true}
                        onChangeText={(password) => this.setState({password})}
                    />
                </View>
                <TouchableHighlight
                    onPress={this.login}
                    style={[styles.loginButton, styles.button]}
                >
                    <Text
                        style={styles.textButton}
                    >Login</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={this.signUp}
                    style={[styles.signupButton, styles.button]}
                >
                    <Text
                        style={styles.textButton}
                    >SignUp</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
        marginHorizontal: 10
    },
    inputText: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingHorizontal: 20,
        paddingVertical: 10,
        color: 'black'
    },
    button: {
        backgroundColor: '#fff',
        paddingVertical: 20,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    textButton: {
        textAlign: 'center'
    },
    containerInputs: {
        marginBottom: 20
    }
})