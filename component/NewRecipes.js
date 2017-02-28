import React, {Component} from 'react'
import {
    Text,
    View,
    Platform,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    Image,
    Dimensions
} from 'react-native'

import Navbar from './Navbar'
import ImagePicker from 'react-native-image-picker'
import Helpers from '../lib/helpers'
import * as firebase from 'firebase'
import Icon from 'react-native-vector-icons/FontAwesome'
import RNFetchBlob from 'react-native-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

export default class NewRecipes extends Component {
    constructor(props){
        super(props)
        this.state = {
            uid: '',
            title: '',
            food: '',
            description: '',
            imagePath: '',
            imageHeight: '',
            imageWidth: ''
        }
    }
    
    componentWillMount() {
        try {
            let user = firebase.auth().currentUser
            this.setState({
                uid: user.uid
            })
        } catch(error){
            console.log(error)
        }
    }
    
    uploadImage = (uri, imageName, mime = 'image/jpg') => {
        return new Promise((resolve, reject) => {
            const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
            let uploadBlob = null
            const imageRef = firebase.storage().ref(`${this.state.uid}/images`).child(imageName)
            fs.readFile(uploadUri, 'base64')
                .then((data) => {
                    return Blob.build(data, {type: `${mime};BASE64`})
                })
                .then((blob) => {
                    uploadBlob = blob
                    return imageRef.put(blob, {contentType: mime})
                })
                .then(() => {
                    uploadBlob.close()
                    return imageRef.getDownloadURL()
                })
                .then((url) => {
                    resolve(url)
                })
                .catch((error) => {
                    reject(error)
                })
        })
    }
    closeView(){
        this.props.navigator.pop()
    }
    openImagepicker(){
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        }
        ImagePicker.showImagePicker(options, (response) => {
            if(response.didCancel){
                console.log('User cancelled image picker')
            } else if (response.error){
                console.log('Error'+ response.error)
            } else if(response.customButton){
                console.log('User tapped custon button'+response.customButton)
            } else {
                this.setState({
                    imagePath: response.uri,
                    imageHeight: response.height,
                    imageWidth: response.width
                })
            }
        })
    }
    saveData(){
        if(this.state.uid){
            if(this.state.title &&
                this.state.food &&
                this.state.description &&
                this.state.imagePath
                ) {
                    try {
                        this.uploadImage(this.state.imagePath, `${Date.now()}.jpg`)
                            .then((responseData) => {
                                const obj = {
                                    title: this.state.title,
                                    food: this.state.food,
                                    description: this.state.description,
                                    image: responseData
                                }
                                Helpers.createNewRecipe(this.state.uid, obj)
                            })
                            .done()
                            this.props.navigator.push({
                                id: 'App'
                            })
                    } catch(error){
                        console.log(error)
                    }
                }
        }
    }
    render(){
        return (
            <View style={styles.container}>
                <Navbar  icon="times" showMenu={this.closeView.bind(this)}/>
                <View style={styles.content}>
                    <View>
                        <View style={styles.containerImage}>
                            {this.state.imagePath ? <Image 
                                style={{width: 100, height: 100, flex: 1, marginRight: 10}}
                                source={{uri: this.state.imagePath}}
                            /> : null }
                        <TouchableHighlight
                            style={[styles.button, {flex: 2, justifyContent: 'center', alignItems: 'center'}]}
                            onPress={this.openImagepicker.bind(this)}
                        >
                            <Icon name="camera" size={18} color="white" />
                        </TouchableHighlight>
                    </View>
                    <View style={styles.containerInput}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput 
                            style={styles.input}
                            value={this.state.title}
                            placeholder="Title of the recipe"
                            placeholderTextColor="white"
                            onChangeText={(title) => this.setState({title})}
                        />
                    </View>
                    <View style={styles.containerInput}>
                        <Text style={styles.label}>Food</Text>
                        <TextInput 
                            style={styles.input}
                            value={this.state.food}
                            placeholder="Food of the recipe"
                            placeholderTextColor="white"
                            onChangeText={(food) => this.setState({food})}
                        />
                    </View>
                    <View style={styles.containerInput}>
                        <TextInput 
                            multiline
                            style={styles.inputTextArea}
                            value={this.state.description}
                            placeholder="Description Recipes"
                            placeholderTextColor="white"
                            onChangeText={(description) => this.setState({description})}
                        />
                    </View>
                </View>
                <View>
                    <TouchableHighlight
                        onPress={this.saveData.bind(this)}
                        style={[styles.button, {marginBottom: 10}]}
                    >
                        <Text style={styles.saveButtonText}>SAVE</Text>
                    </TouchableHighlight>
                </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'grey'
    },
    content: {
        flex: 1,
        paddingHorizontal: 10,
        marginTop: 10,
        justifyContent: 'space-between'
    },
    label: {
        flex: 1,
        fontSize: 18
    },
    input: {
        flex: 2,
        fontSize: 18,
        height: 40
    },
    inputTextArea: {
        height: 200,
        flex: 1,
        fontSize: 18
    },
    containerInput: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#cecece',
        alignItems: 'center',
        marginBottom: 10
    },
    containerImage: {
        flexDirection: 'row'
    },
    button: {
        borderWidth: 1,
        borderColor: 'white',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 3
    },
    saveButtonText: {
        color: 'white'
    }
})