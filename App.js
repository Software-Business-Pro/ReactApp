import * as React from 'react';
import { View, Text, Image } from 'react-native';
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
import Map from './src/Map/Map';
import HomeScreen from './src/HomeScreen/HomeScreen';
import Api from './src/ApiData/ApiData';
import Config from "react-native-config";
import axios from 'axios';

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} >
      <DrawerItemList {...props} />
      <DrawerItem label="Help" onPress={() => alert('Link to help')} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

function MyDrawer(props) {
  const apiData = props.apiData;
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Accueil"  component={HomeScreen}/>
      <Drawer.Screen name="Carte"  component={props => <Map {...props} apiData={apiData.vehicles}/>}/>
      <Drawer.Screen name="Ocr"  component={Ocr}/>
    </Drawer.Navigator>
  );
}

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.state = {apiData: {}};
  }

  async componentDidMount() {
    // Get data
    let apiResult = await Api.getAllData();
    this.setState({ apiData: apiResult });
    this.setState({ loading: false });
  }

  render() {
      return (
        <Root>
          <NavigationContainer>
            <MyDrawer apiData={this.state.apiData}/>
          </NavigationContainer>
        </Root>
      );
    
  }
}
