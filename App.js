import * as React from 'react';
import { View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import { Root } from "native-base";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import Ocr from './src/Ocr/Ocr';
import Map from './src/Map/Map';
import HomeScreen from './src/HomeScreen/HomeScreen';
import Config from "react-native-config";

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props} >
      <DrawerItemList {...props} />
      <DrawerItem label="Help" onPress={() => alert('Link to help')} />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();
function Feed() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Feed Screen</Text>
    </View>
  );
}

function Article() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Article Screen</Text>
    </View>
  );
}
function MyDrawer() {
  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Accueil"  component={HomeScreen}/>
      <Drawer.Screen name="Carte"  component={Map}/>
      <Drawer.Screen name="Ocr"  component={Ocr}/>
    </Drawer.Navigator>
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
  }
  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({ loading: false });
  }
  render() {
      return (
        <Root>
          <NavigationContainer>
            <MyDrawer />
          </NavigationContainer>
        </Root>
      );
    
  }
}
