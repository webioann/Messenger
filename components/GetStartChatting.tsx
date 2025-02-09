import { TouchableOpacity } from 'react-native'
import React from 'react'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import { useUserContext } from '../context/UserContext';
import { metadataType, messageType } from '../Types/chats_types';
import { UseNavigation_Type } from '../Types/navigation_types';
import { useNavigation } from '@react-navigation/native';
import { UserType } from '../Types/users_types';
import useChatRoomIDCreator from '../hooks/useChatRoomIDCreator';
import useColorSchemeContext from '../hooks/useColorSchemeContext';

const GetStartChatting: React.FC<UserType> = (contact) => {
    // when you click the chat icon created a chat room ID, and you can start chatting with this user
    const { currentUser } = useUserContext()
    const navigation = useNavigation<UseNavigation_Type>();
    const chatRoomID = useChatRoomIDCreator(contact.uid)
    const { COLORS } = useColorSchemeContext()

    const onStartChatting = async() => {
        let roomWasCreated = false
        // this checks if the chat room exists in the 'CHAT_ROOM_DB' collection
        await firestore().collection('CHAT_ROOM_DB').doc(chatRoomID).get()
        .then((response) => {
            response.data() ? roomWasCreated = true : roomWasCreated = false
        })
        if( !roomWasCreated && currentUser) {
            // if a chat room is created for the first time fill metadata object
            let rawMetadata: metadataType = {
                startAt: Date.now(),
                users: [currentUser?.uid, contact.uid]
            }
            let rawMessages: messageType[] = []
            await firestore().collection('CHAT_ROOM_DB').doc(chatRoomID).set({ 
                metadata: rawMetadata, 
                messages: rawMessages 
            })
            .then(() => navigation.navigate('Chat', {
                contact: contact.displayName,
                avatar_url: contact.photoURL,
                room: chatRoomID,
                contactId: contact.uid
            }))
        }
        if( roomWasCreated ) {
            // navigate to screen "Chat" with  passing user data for chatting
            navigation.navigate('Chat', {
                contact: contact.displayName,
                avatar_url: contact.photoURL,
                room: chatRoomID,
                contactId: contact.uid
            })
        }
    }

    return (
        <TouchableOpacity 
            onPress={onStartChatting}>
            <Icon2 name='message-outline' size={24} color={COLORS.tint}/>
        </TouchableOpacity>
    )
}

export default GetStartChatting;

