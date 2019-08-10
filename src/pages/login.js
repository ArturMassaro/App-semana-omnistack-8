import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Platform, Text, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import Logo from '../assets/logo.png'

import api from '../services/api'

export default function Login({ navigation })  { 

    const [user, setUser] = useState('')

    useEffect(() => {
        AsyncStorage.getItem('user').then(
            user=> {
                if(user){
                    console.log(user)
                    navigation.navigate('Main', { user: user })
                }
            }
        )
    }, [])

    async function handleLogin(){

        const response = await api.post('/devs', {username: user})
        const { _id } = response.data
        console.log(_id)
        await AsyncStorage.setItem('user', _id)
 
        navigation.navigate('Main', { user: _id })
    }

    return (<KeyboardAvoidingView 
        behavior= "padding"
        enabled={Platform.os === 'ios'}
        style={stylesheet.container}
        >
        <Image source={Logo} />

        <TextInput 
        autoCapitalize= "none"
        autoCorrect={false}
        placeholder="Digite seu usuario do github"
        placeholderTextColor="#999"
        style={stylesheet.input}
        value={user}
        onChangeText={setUser}
         />

         <TouchableOpacity onPress={handleLogin} style={stylesheet.button}>
            <Text style={stylesheet.buttontext}>Entrar</Text>
         </TouchableOpacity>

    </KeyboardAvoidingView>)

}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: "center",
        padding: 30
    },
    input:{
        height:46,
        alignSelf: "stretch",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        marginTop: 20,
        paddingHorizontal: 15
    },
    button:{
        height: 46,
        alignSelf: "stretch",
        backgroundColor: '#df4723',
        borderRadius: 4,
        marginTop: 15,
        justifyContent: "center",
        alignItems: "center"
    },
    buttontext:{
        color: '#fff',
        fontWeight: "bold",
        fontSize: 20
    }
})