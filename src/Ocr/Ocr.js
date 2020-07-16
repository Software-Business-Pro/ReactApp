import React from "react";
import {StyleSheet, Text, View, TouchableOpacity} from "react-native";
import { RNCamera } from 'react-native-camera';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content } from "native-base";
import {PermissionsAndroid} from 'react-native';
import RNTextDetector from "react-native-text-detector";
import Dimensions from './Dimensions';
import Api from "../ApiData/ApiData";
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function MyStack() {
  return (
    <Stack.Navigator headerMode={"none"}>
      <Stack.Screen name="Camera" component={Ocr} />
      <Stack.Screen name="Infos" component={Infos}/>
    </Stack.Navigator>
  );
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
// Component for displaying infos when immatriculation match
export function Infos(props) {
  let vehicle = {}
  let text = null
  let infos = null
  if(props.route.params && props.route.params.vehicle && props.route.params.vehicle[0]) vehicle = props.route.params.vehicle[0]
  if(props.route.params && props.route.params.text && props.route.params.text[0].text) text = props.route.params.text[0].text

  if(!isEmpty(vehicle)) {
    
  infos = ( <View style={{padding: 8, paddingTop: 20}}><Text style={{fontWeight: "bold", fontSize: 15}}>Informations du véhicule({props.route.params.text}):</Text>
            <Text>{"\n"}</Text>
            <Text>Référence: {vehicle.matRef}</Text>
            <Text>Equipement: {vehicle.matLibelle}</Text>
            <Text>Statut: {vehicle.sLocStatus}</Text>
            <Text>Numéro de série: {vehicle.matNumSerie}</Text>
            <Text>Plaque d'immatriculation: {vehicle.matImatriculation}</Text>
            <Text>Longueur du véhicule: {vehicle.matLongueur}</Text>
            <Text>Largeur du véhicule: {vehicle.matLargeur}</Text>
            <Text>Hauteur du véhicule: {vehicle.matHauteur}</Text>
            <Text>Poid du véhicule: {vehicle.matPoids}</Text>
            <Text>Remarque: {vehicle.remarque}</Text></View>
          )
  }
  else {
    infos = (
      <View style={{padding: 8, paddingTop: 20}}>
        <Text style={{fontSize: 14}}>Aucun véhicule ne comporte la plaque d'immatriculation: {props.route.params.text}</Text>
      </View>
    )
  }
  return (
    <Container>
    <Header>
    <Left>
      <Button
        transparent
        onPress={() => props.navigation.openDrawer()}>
        <Icon name="menu" />
      </Button>
    </Left>
    <Body>
      <Title>Informations véhicule</Title>
    </Body>
    <Right />
  </Header>
  <Content>
  <View>
    {infos}
    </View>
    <View style={style.buttonInfos}>
      <Button primary rounded success title="back" onPress={() => props.navigation.goBack()}>
          <Text style={{color: "white", textAlign: "center", width: 100}}>Revenir</Text>
      </Button>
    </View>
  </Content>
  </Container>
      
  )
}

export class Ocr extends React.Component {
    constructor(props) {
      super(props);
      this.vehicles = {}
  }

  async componentDidMount() {
    this.vehicles = await (await Api.GetVehiclesDetails()).data;
  }
  // Take an immat and return a vehicle with this immat
  findVehiclesByImmat(arrayText) {
    let res = []
    let text = ""
    if(arrayText[0]) {
      res= this.vehicles.filter(v => v.matImatriculation === arrayText[0].text)
      text = arrayText[0].text
    }
    this.props.navigation.navigate('Infos', {
      vehicle: res,
      text: text
   });

  }
  // Permission for read and write storage
  requestRWPermissions = async () => {
    const checkReadExternalStorage = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    const checkWriteExternalStorage = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if (checkReadExternalStorage === PermissionsAndroid.RESULTS.GRANTED && checkWriteExternalStorage === PermissionsAndroid.RESULTS.GRANTED ) {
        //alert("You've have read/write permission");
    } else {
        try {
            const grantedRead = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    'title': 'FollowUP App required read external storage permission',
                    'message': 'We required read external storage permission in order to get device location ' +
                        'Please grant us.'
                }
            )
            const grantedWrite = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': 'FollowUP App required write external storage permission',
                    'message': 'We required write external storage permission in order to get device location ' +
                        'Please grant us.'
                }
            )
            if (grantedRead === PermissionsAndroid.RESULTS.GRANTED && grantedWrite === PermissionsAndroid.RESULTS.GRANTED) {
                this.takePicture();
            
            } else {
                //alert("You don't have read/write permission");
            }
        } catch (err) {
            alert(err)
        }
    }
};
  // Taking picture with camera
  takePicture = async () => {
    if (this.camera) {
      const data = await this.camera.takePictureAsync();
      this.detectText(data.uri);
    }
  };
  // Detect text with tesseract
  detectText = async (uri) =>
  {
    const visionResp = await RNTextDetector.detectFromUri(uri);
    this.findVehiclesByImmat(visionResp)
  }

  displayText(tabText) {
    let res = "";
    for (const e of tabText) {
      res += (e.text + "\n");
    }
    return res;
  }

  render() {
    return (
    <Container>
      <Header>
      <Left>
        <Button
          transparent
          onPress={() => this.props.navigation.openDrawer()}>
          <Icon name="menu" />
        </Button>
      </Left>
      <Body>
        <Title>Détéction de plaque</Title>
      </Body>
      <Right />
    </Header>
      <View style={style.screen}>
        <RNCamera
          style={style.camera}
          ref={ref => {
            this.camera = ref
          }}
          notAuthorizedView={null}
          playSoundOnCapture
        >
        </RNCamera>
        <View style={style.buttonContainer}>
            <TouchableOpacity
              onPress={this.requestRWPermissions.bind(this)}
              style={style.button}
            />
          </View>
      </View>
    </Container>
    )
  }
}

const style = StyleSheet.create({
  screen: {
    backgroundColor: "#000000",
    flex: 1
  },
  camera: {
    position: "absolute",
    width: Dimensions.screenWidth,
    height: Dimensions.screenHeight,
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    flex: 1
  },
  buttonContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    width: 64,
    height: 64,
    backgroundColor: "#ffffff",
    borderRadius: 32,
    borderWidth: 4,
    borderColor: "#000000"
  },
  buttonInfos: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 5
  },
});

