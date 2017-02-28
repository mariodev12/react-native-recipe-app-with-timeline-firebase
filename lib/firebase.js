import * as firebase from 'firebase'

class Firebase {
    static init(){
        firebase.initializeApp({
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            storageBucket: "",
        });
    }
}

module.exports = Firebase