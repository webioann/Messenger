import React, { useState, useEffect } from 'react';
import { StyleSheet, Button , FlatList } from 'react-native';
import SearchInput from '../components/SearchInput';
import ChatPreview from '../components/ChatPreview';
import NavigationHeader from '../components/NavigationHeader';
import { SIZES } from '../constants/SIZES';
import firestore from '@react-native-firebase/firestore';
import { UserType } from '../Types/users_types';
import ScreenWrapper from './ScreenWrapper';
import { useUserContext } from '../context/UserContext';

const Messager_Screen = () => {
  const [searchQuery, setSearchQuery] = useState<string | null>(null)
  const [contactsList, setContactsList] = useState<UserType[]>([])
  const { currentUser } = useUserContext()

const fetchAllChattingUsers = async() => {
  if (currentUser?.uid) {
    const contactsDocs = await firestore().collection('USERS_DB').get();
    const currentUserShortId = currentUser?.uid.slice(0, 8)
    let contacts = contactsDocs.docs.map((doc) => ({...doc.data()}))
    let temp = contacts.filter((contact) => { 
      let chatRoomID: string | null = null
      const shortContactID = contact.uid.slice(0, 8)
      if( shortContactID > currentUserShortId ) {
        chatRoomID = shortContactID.concat('_@_', currentUserShortId)
      }
      if( currentUserShortId > shortContactID ) {
        chatRoomID = currentUserShortId.concat('_@_', shortContactID)
      }
      return chatRoomID
    })
    setContactsList(temp as UserType[])
  }
  else return
}
useEffect(() => {
  fetchAllChattingUsers()
}, [])

useEffect(() => {
  if (searchQuery && contactsList.length > 0 ) {
    let temp = contactsList.filter(item => item.displayName && item.displayName.toLowerCase() == searchQuery.toLowerCase())
    // console.log(temp)
    // temp && setContactsList(temp)
    // setSearchQuery(null)
  }
  else return
}, [searchQuery])

  return (
    <ScreenWrapper>
      <NavigationHeader type='drawer' screen='Messager'>
        <SearchInput getSearchQuery={setSearchQuery}/>
      </NavigationHeader>
      <FlatList 
        data={contactsList}
        renderItem={({item}) => <ChatPreview {...item}/>}
        keyExtractor={item => item.uid}
        style={{paddingHorizontal: 16}}
      />
    </ScreenWrapper>
  )
}

export default Messager_Screen;

