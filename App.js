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
import Map from './src/Map/Map';
import HomeScreen from './src/HomeScreen/HomeScreen';
import Api from './src/ApiData/ApiData';
import Config from "react-native-config";
import axios from 'axios';
import Animated from 'react-native-reanimated';

function CustomDrawerContent({ progress, ...rest }) {
  const translateX = Animated.interpolate(progress, {
    inputRange: [0, 1],
    outputRange: [-100, 0],
  });

  return (
    <DrawerContentScrollView {...rest}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <DrawerItemList {...rest} />
        <DrawerItem label="Help" onPress={() => alert('Link to help')} />
      </Animated.View>
    </DrawerContentScrollView>
  );
}
const Drawer = createDrawerNavigator();

function MyDrawer(props) {
  const apiData = props.apiData;
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}   drawerStyle={{
      width: dimensions.width * 0.7,
    }}>
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
    this.apiData = {};
  }

  async componentDidMount() {
    // Get data
    let apiResult = await Api.getAllData();
    this.apiData = apiResult;
    this.setState({ loading: false });
  }

  render() {
      return (
        <Root>
          <NavigationContainer>
            <MyDrawer apiData={this.apiData}/>
          </NavigationContainer>
        </Root>
      );
    
  }
}
