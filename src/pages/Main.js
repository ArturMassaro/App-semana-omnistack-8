import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../services/api'

import Logo from '../assets/logo.png'
import Like from '../assets/like.png'
import Dislike from '../assets/dislike.png'
import itsamatch from '../assets/itsamatch.png'


export default function main({ navigation }) {
    const id = navigation.getParam('user')
    const [users, setUsers ] = useState([]);
    const [matchDev, setMatchDev] = useState(null)
  
    console.log(id)

    useEffect(() =>{
        const socket = io('http://192.168.0.3:3333', {
            query: { user: id }
        });
        socket.on('match', (dev) => {
            setMatchDev(dev)
        })

        socket.on('hello', (dev) => {
            // setMatchDev(dev)
            console.log(dev)
        })

        
    },  [id]);
    useEffect(() => {
 
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: id,
                }
            })
            console.log(response.data);

            console.log(response.data);

            setUsers(response.data);
            console.log(users.length);

        }

        loadUsers();
    }, [id]);

    async function handleLike(){
        const [user, ...rest] = users
        await api.post(`/devs/${user._id}/likes`, null, {
            headers: {
                user: id
            }
        })
        setUsers(rest)
    }

    async function handleDislike(){
        const [user, ...rest] = users

        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: {
                user: id
            }
        })

        setUsers(rest)
    }

    async function handleLogout(){
        await AsyncStorage.getItem('user').then(
            user => {
                if(user){
                    AsyncStorage.removeItem('user')
                    navigation.navigate('login')
                    // navigation.navigate('tela3')

                }
            }
        )
    }



    return (
        <SafeAreaView style={stylesheet.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image onPress={handleLogout} source={Logo} style={ stylesheet.logo }/>
            </TouchableOpacity>
            <View style={stylesheet.cardsContainer}>
                {
                    users.length > 0 ? (
                        users.map((user, index) =>(
                        <View key={user._id} style={[stylesheet.card, { zIndex: (users.length - index) }]}>
                            <Image style={stylesheet.avatar} source={{uri: user.avatar}} />
                            <View style={stylesheet.footer}>
                                <Text style={stylesheet.name}>{user.name}</Text>
                                <Text style={stylesheet.bio} numberOfLines={3}>{user.bio}</Text>
                            </View>
                        </View>
                    ))
                    ) : <Text style={stylesheet.empty}>Acabou :(</Text>
                }
                
                
            </View>

            { users.length > 0 && 
            <View style={stylesheet.buttonsContainer}>
                <TouchableOpacity onPress={handleDislike} style={stylesheet.buttons}>
                    <Image source={Dislike} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLike} style={stylesheet.buttons}>
                    <Image source={Like} />
                </TouchableOpacity>

            </View> }

            { 
                matchDev && (
                    <View style={[stylesheet.matchContainer, { zIndex: users.length + 1 }]}>
                        <Image style={stylesheet.itsamatch} source={itsamatch} />
                        <Image style={stylesheet.matchAvatar} className="avatar" source={{ uri: matchDev.avatar }} />

                        <Text style={stylesheet.matchName}>{matchDev.name}</Text>
                        <Text style={stylesheet.matchBio}>{matchDev.bio}</Text>

                        {/* <Image style={stylesheet.matchAvatar} className="avatar" source={matchDev.avatar} />

                        <Text style={stylesheet.matchName}>Artur Massaro</Text>
                        <Text style={stylesheet.matchBio}>asdhalvasudasd shdlaydas ukjasgdjhasgdq7yod pyagsdouadgsaoudy</Text> */}

                        <TouchableOpacity onPress={ () => { setMatchDev(null) } }>
                            <Text style={stylesheet.closeMatch} >FECHAR</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        </SafeAreaView>
    )
}

const stylesheet = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#f5f5f5',
        alignItems: "center",
        justifyContent: "space-between"
    },
    cardsContainer:{
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "center",
        maxHeight: 500,

    },
    card: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        margin: 30,
        overflow: "hidden",
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    avatar:{
        flex: 1,
        height: 300
    },
    footer: {
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 15
    },
    name:{
        fontSize: 16,
        fontWeight: "bold",
        color: '#333'
    },
    bio:{
        fontSize:14,
        color: '#999',
        marginTop: 5,
        lineHeight: 18
    },
    logo:{
        marginTop: 30
    },
    buttonsContainer:{
        flexDirection: "row",
        marginBottom:30
    },
    buttons:{
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {
            width: 0,
            height:2
        },
    },
    empty:{
        alignSelf: "center",
        fontSize: 24,
        fontWeight: "bold",
        color: '#999'
    },

    matchContainer:{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.80)',
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
    },
    itsamatch:{
        height: 60,
        resizeMode: "contain"
    },
    matchAvatar:{
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 5,
        borderColor: '#fff',
        marginVertical: 30,
    },
    matchName:{
        fontSize: 26,
        fontWeight: "bold",
        color: '#fff'
    },
    matchBio:{
        marginTop: 10,
        fontSize: 16,
        color: 'rgba(255,255,255, 0.8)',
        lineHeight: 24,
        textAlign: "center",
        paddingHorizontal: 30
    },
    closeMatch:{
        fontSize: 16,
        color: 'rgba(255,255,255, 0.8)',
        textAlign: "center",
        marginTop: 30,
        fontWeight: "bold",
    }

})