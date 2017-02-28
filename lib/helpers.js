import * as firebase from 'firebase'

class Helpers {
    static createNewRecipe(userId, obj){
        let userNamePath = "/user/"+userId+"/recipes/"+Date.now()
        return firebase.database().ref(userNamePath).set(obj)
    }
    static getUserRecipes(userId, callback){
        let userNamePath = "/user/"+userId
        firebase.database().ref(userNamePath).on('value', (snapshot) => {
            let data = snapshot.val()
            if(snapshot){
                if(data.recipes){
                    let obj = {
                        name: data.details.name,
                        url: data.details.url,
                        recipes: data.recipes
                    }
                    callback(obj)
                }
            }
        })
    }
    static getAllRecipes(callback){
        let pathName = "/user/"
        firebase.database().ref(pathName).on('value', (snapshot) => {
            let data = snapshot.val()
            let arrayOfRecipes = []
            if(data){
                for(let key in data){
                    let obj = data[key]

                    let name = obj.details.name
                    let photo = obj.details.url

                    for(let prop in obj){
                        let recipes = obj[prop]
                        for(let rc in recipes){
                            if(recipes[rc].description && recipes[rc].food &&
                                recipes[rc].title && recipes[rc].image
                            ) {
                                arrayOfRecipes.push({
                                    userName: name,
                                    userPhoto: photo,
                                    title: recipes[rc].title,
                                    description: recipes[rc].description,
                                    food: recipes[rc].food,
                                    image: recipes[rc].image
                                })
                            }
                        }
                    }
                }
            }
            callback(arrayOfRecipes)
        })
    }
    static setUserName(userId, name){
        let userNamePath = "/user/"+userId+"/details/name"
        return firebase.database().ref(userNamePath).set(name)
    }

    static setUserBio(userId, bio){
        let userNamePath = "/user/"+userId+"/details/bio"
        return firebase.database().ref(userNamePath).set(bio)
    }

    static setUserPlace(userId, place){
        let userNamePath = "/user/"+userId+"/details/place"
        return firebase.database().ref(userNamePath).set(place)
    }

    static setImageUrl(userId, url){
        let userNamePath = "/user/"+userId+"/details/url"
        return firebase.database().ref(userNamePath).set(url)
    }
    static getImageUrl(userId, callback){
        let userNamePath = "/user/"+userId+"/details/url"
        firebase.database().ref(userNamePath).on('value', (snapshot) => {
            let imageUrl = ''
            if(snapshot.val()){
                imageUrl = snapshot.val()
            }
            callback(imageUrl)
        })
    }
    static getName(userId, callback){
        let userNamePath = "/user/"+userId+"/details/name"
        firebase.database().ref(userNamePath).on('value', (snapshot) => {
            let name = ''
            if(snapshot.val()){
                name = snapshot.val()
            }
            callback(name)
        })
    }
}

module.exports = Helpers