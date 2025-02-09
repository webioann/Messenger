import { StyleSheet, Text, View, Switch, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem} from '@react-navigation/drawer';
import UserAvatarImage from '../components/UserAvatarImage';
import { useUserContext } from '../context/UserContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { UseNavigation_Type } from '../Types/navigation_types';
import { SIZES } from '../constants/SIZES';
import useColorSchemeContext from '../hooks/useColorSchemeContext';
import auth from '@react-native-firebase/auth';

const DrawerNavigatorContent = ({...props}) => {
    const { currentUser, restartAuthState } = useUserContext()
    const navigation = useNavigation<UseNavigation_Type>();
    const { COLORS, toggleColorScheme, appColorScheme } = useColorSchemeContext()

    const signOutWithAlert = () => {
        Alert.alert('WARNING', 'Do you really want logout?', [
            { text: 'YES', onPress : () => {
                auth().signOut()
                .then(() => restartAuthState())
                .then(() => navigation.navigate('Welcome'))
                .catch(error => console.log(`_AUTH_SIGN_OUT_ERROR_ --> ${error}`))
            }},
            { text: 'NOT', onPress : () => {return}, style: 'cancel'},
        ])
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={[styles.drawer_header, {backgroundColor: COLORS.minor, borderBottomColor: COLORS.third}]}>
                <UserAvatarImage pathToImage={currentUser?.photoURL} size={70}/>
                <View>
                    <Text style={[styles.user_name, {color: COLORS.color}]}>
                        {currentUser?.displayName ? currentUser.displayName : 'DEFAULT NAME'}
                    </Text>
                    <Text style={[styles.user_email, {color: COLORS.color}]}>
                        {currentUser?.email ? currentUser.email : 'EMAIL'}
                    </Text>
                </View>
            </View>
            <DrawerContentScrollView style={{backgroundColor: COLORS.main}}>
                <DrawerItemList 
                    state={navigation.getParent()}
                    navigation={navigation.getParent()}
                    descriptors={navigation.getParent()}
                    {...props}
                />
            </DrawerContentScrollView> 
            {/* footer of menu hose to contained theme toggle button (Switch) and Logout user button*/}
            <View style={[styles.drawer_footer, {backgroundColor: COLORS.minor, borderTopColor: COLORS.third}]}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 30, padding: 8, paddingBottom: 30}}>
                    <Text style={{color: COLORS.color, fontSize: 18, fontWeight: '700'}}>Dark theme mode</Text>
                    <Switch 
                        onChange={toggleColorScheme}
                        thumbColor={appColorScheme === 'light' ? COLORS.blue : COLORS.adorn}
                        value={appColorScheme === 'light' ? true : false}
                        trackColor={{true: COLORS.accent, false: COLORS.grey}}
                    />
                </View>
                <TouchableOpacity
                    onPress={signOutWithAlert}
                    style={{flexDirection: 'row', alignItems: 'center', gap: 30, padding: 8}}>
                    <Icon name='logout' size={24} color={COLORS.orange}/>
                    <Text style={{color: COLORS.color, fontSize: 18, fontWeight: '700'}}>Log out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default DrawerNavigatorContent;

const styles = StyleSheet.create({
    drawer_header: {
        marginTop: -4, // - 4px when use SafeAreaView
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingVertical: 30,
        paddingHorizontal: SIZES.GAP,
        borderBottomWidth: 1
    },
    user_name: {
        fontSize: 20,
        fontWeight: '600'
    },
    user_email: {
        fontSize: 16
    },
    drawer_footer: {
        justifyContent: 'flex-end',
        padding: 16,
        borderTopWidth: 1
    },
})