import * as React from 'react';
import { View, Text, Image, useWindowDimensions  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import { Root } from "native-base";
import * as Font from 'expo-font';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Ocr from './src/Ocr/Ocr';
import HomeMap from './src/Map/Map';
import HomeScreen from './src/HomeScreen/HomeScreen';
import Pickertest from './src/Picker/Picker';
import Api from './src/ApiData/ApiData';
import Config from "react-native-config";
import axios from 'axios';
import Animated from 'react-native-reanimated';
import Login from './src/Login/Login'
import { NativeRouter, Route, Redirect, Link, useHistory } from "react-router-native";

function CustomDrawerContent({ progress, ...rest }) {
  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
    useNativeDriver: true
  });
  let history = useHistory();
  return (
    <DrawerContentScrollView {...rest}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <DrawerItemList {...rest} />
        <DrawerItem label="Help" onPress={() => alert('Link to help')} />
        
        <DrawerItem label="Déconnection" onPress={() => history.push("/")} />
        
      </Animated.View>
    </DrawerContentScrollView>
  );
}
const Drawer = createDrawerNavigator();

function MyDrawer(props) {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} drawerStyle={{
      width: dimensions.width * 0.7,
    }} >
      <Drawer.Screen name="Accueil"  component={HomeScreen}/>
      <Drawer.Screen name="Carte intéractive"  component={HomeMap}/>
      <Drawer.Screen name="Envoi d'image"  component={Pickertest}/>
      <Drawer.Screen name="Détéction de plaque"  component={Ocr}/>
    </Drawer.Navigator>
  );
}

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.user = null;
  }

  test(props) {
    //console.log(props)
  }
  render() {
      return (
        <Root>
          {/*<NavigationContainer>
            <MyDrawer />
          </NavigationContainer>*/}
          <NativeRouter>
            <Route exact path="/" render={(props) => <Login {...props} />} />
            <Route path="/app" render={(props) => props.location.state.user ? 
              (<NavigationContainer>
            <MyDrawer />
          </NavigationContainer>) : 
          (<Redirect to="/"/>)}/>
          </NativeRouter>
        </Root>


      );
    
  }
}
