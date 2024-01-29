import React, { useState } from "react"
import { Appbar, Button, Menu } from "react-native-paper"
import { SvgIconHolder } from "./SvgIconHolder"
import { Text } from "@react-native-material/core"
import { Path, Svg } from "react-native-svg"


const NavBar = (props)=>{
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    const [qmVisible, setQmVisible] = useState(false);

    const openQmMenu = () => setQmVisible(true);
    const closeQmMenu = () => setQmVisible(false);


  const handleLogout = async () => {
    // Clear the stored token and user data
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    // Navigate back to the login screen
    navigation.navigate('Login');
    closeMenu()
  };


    return (
    <Appbar.Header style={{ backgroundColor: '#102372' }}>
    <Button style={{}} onPress={props.onPressBack}>
    <SvgIconHolder
    d="M3.443 9.062C3.158 8.777 3 8.402 3 8.002c0-.403.158-.78.443-1.062L10.276.293c.395-.39 1.033-.39 1.428 0s.395 1.024 0 1.413L5.228 8.002l6.476 6.294c.395.39.395 1.024 0 1.415-.395.39-1.033.39-1.428-.002L3.443 9.063z"
    fill="white"
    />

    </Button>
    <Appbar.Content
    titleStyle={{textAlign:'left'}}

    title={

    <Text variant="button" style={{color: 'white', fontWeight: 'bold', fontSize:16 }}>
        {props.Title}
    </Text>
    }
    />


<Menu
visible={visible}
onDismiss={closeMenu}
anchor={
<Button
size={20}
onPress={() => openMenu()}
>
<Svg width={16} height={16} viewBox="0 0 16 16">
<Path
d="M13 5c0-2.76-2.24-5-5-5S3 2.24 3 5c0 1.52.678 2.882 1.75 3.8C2.52 9.97 1 12.306 1 15c0 .552.448 1 1 1s1-.448 1-1c0-2.76 2.24-5 5-5s5 2.24 5 5c0 .552.448 1 1 1s1-.448 1-1c0-2.693-1.52-5.03-3.75-6.2C12.323 7.88 13 6.52 13 5zM8 8C6.343 8 5 6.657 5 5s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
fill="white" // Set the desired color here
/>
</Svg>
</Button>

}
>
<Menu.Item onPress={() => { /* Add functionality for Account Settings */ }} title="Account Settings" />

<Menu.Item onPress={handleLogout} title="Logout" />
</Menu>
</Appbar.Header>
    )
}

export default NavBar;