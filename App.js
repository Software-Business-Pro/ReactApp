import * as React from 'react';
import { View, Text, Image, useWindowDimensions  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Root, Icon } from "native-base";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import MyStack from './src/Ocr/Ocr';
import HomeMap from './src/Map/Map';
import HomeScreen from './src/HomeScreen/HomeScreen';
import Pickertest from './src/Picker/Picker';
import Config from "react-native-config";
import Animated from 'react-native-reanimated';
import Login from './src/Login/Login'
import { NativeRouter, Route, Redirect, Link, useHistory } from "react-router-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Details from './src/Map/Details';

function CustomDrawerContent({ progress, ...rest }) {
  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0]
  });
  let history = useHistory();
  return (
    <DrawerContentScrollView {...rest}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <DrawerItemList {...rest} />
        <DrawerItem label="Aide" onPress={() => alert('Link to help')} icon={ ({ focused, size, color }) =>
          <MaterialCommunityIcons color={focused ? '#000' : '#ccc'}
                size={size} 
                name={focused ? 'help-circle' : 'help-circle-outline'} 
                color={focused ? color : '#ccc'}/> 
         }/>
        <DrawerItem label="Déconnection" onPress={() => history.push("/")} icon={ ({ focused, size, color }) =>
          <MaterialCommunityIcons color={focused ? '#000' : '#ccc'}
                size={size} 
                name={'logout'}
                color={focused ? color : '#ccc'} /> 
         }/>
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
      <Drawer.Screen name="Accueil"  component={HomeScreen} options={{drawerIcon: ({focused, size, color}) => (
            <MaterialCommunityIcons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={focused ? color : '#ccc'}
            />
          )}}/>
      <Drawer.Screen name="Carte intéractive"  component={HomeMap}  options={{drawerIcon: ({focused, size, color}) => (
            <MaterialCommunityIcons
              name={focused ? "map-marker" : "map-marker-outline"}
              size={size}
              color={focused ? color : '#ccc'}
            />
          )}}/>
      <Drawer.Screen name="Envoi d'image"  component={Pickertest} options={{drawerIcon: ({focused, size, color}) => (
            <MaterialCommunityIcons
              name={"image-plus"}
              size={size}
              color={focused ? color : '#ccc'}
            />
          )}}/>
      <Drawer.Screen name="Détéction de plaque"  component={MyStack} options={{drawerIcon: ({focused, size, color}) => (
            <MaterialCommunityIcons 
              name={focused ? "camera" : "camera-outline"}
              size={size}
              color={focused ? color : '#ccc'}
            />
          )}}/>
    </Drawer.Navigator>
  );
}

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.user = null;
  }

  render() {
      return (
        <Root>
          <NativeRouter>
            <Route exact path="/" render={(props) => <Login {...props} />} />
            <Route exact path="/details" component={({history, props}) => {return <Details props={props} history={history}/>}}/>
            <Route path="/app" render={(props) => props.location.state.user ? 
              (<NavigationContainer>
            <MyDrawer/>
          </NavigationContainer>) : 
          (<Redirect to="/"/>)}/>
          </NativeRouter>
        </Root>
      );
  }
}
