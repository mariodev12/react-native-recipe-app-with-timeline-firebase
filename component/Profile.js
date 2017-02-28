import React, {Component} from 'react'
import {
    Text,
    StyleSheet,
    View,
    TouchableHighlight,
    Image,
    TextInput,
    Platform
} from 'react-native'

import ImagePicker from 'react-native-image-picker'
import Helpers from '../lib/helpers'
import * as firebase from 'firebase'
import RNFetchBlob from 'react-native-fetch-blob'

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob

const uploadImage = (uri, imageName, mime = 'image/jpg') => {
    return new Promise((resolve, reject) => {
        const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        let uploadBlob = null
        const imageRef = firebase.storage().ref('images').child(imageName)
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

export default class Profile extends Component {
    constructor(props){
        super(props)
        this.state = {
            imagePath: '',
            imageHeight: '',
            imageWidth:'',
            name: '',
            bio: '',
            place: '',
            uid: ''
        }
    }
    
    async componentWillMount () {
        try {
            let user = await firebase.auth().currentUser;
            this.setState({
                uid: user.uid
            })
        } catch(error){
            console.log(error)
        }
    }
    
    openImagePicker(){
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
    saveForm(){
        if(this.state.uid){
            try {
                this.state.name ? Helpers.setUserName(this.state.uid, this.state.name) : null
                this.state.bio ? Helpers.setUserBio(this.state.uid, this.state.bio) : null
                this.state.place ? Helpers.setUserPlace(this.state.uid, this.state.place) : null
                this.state.imagePath ? 
                    uploadImage(this.state.imagePath, `${this.state.uid}.jpg`)
                        .then((responseData) => {
                            Helpers.setImageUrl(this.state.uid, responseData)
                        })
                        .done()
                : null
            } catch(error){
                console.log(error)
            }
        }
    }
    render(){
        return (
            <View style={styles.container}>
                {this.state.imagePath ? <Image style={{width: 100, height: 100}} source={{uri: this.state.imagePath}} /> : null}
                <TouchableHighlight
                    onPress={this.openImagePicker.bind(this)}
                >
                    <Text>Open Camera</Text>
                </TouchableHighlight>
                <TextInput 
                    style={styles.textInput}
                    placeholder="Your name"
                    value={this.state.name}
                    onChangeText={(name) => this.setState({name})}
                />
                <TextInput 
                    style={styles.textInput}
                    placeholder="Bio"
                    value={this.state.bio}
                    onChangeText={(bio) => this.setState({bio})}
                />
                <TextInput 
                    style={styles.textInput}
                    placeholder="Place"
                    value={this.state.place}
                    onChangeText={(place) => this.setState({place})}
                />
                <TouchableHighlight
                    style={styles.buttonSave}
                    onPress={this.saveForm.bind(this)}
                >
                    <Text>Save</Text>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginHorizontal: 10
    },
    textInput: {
        height: 30,
        borderWidth: 1,
        borderColor: '#cecece',
        marginBottom: 20
    },
    buttonSave: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 10
    }
})