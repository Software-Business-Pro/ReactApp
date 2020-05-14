import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, Toast } from "native-base";
import {PermissionsAndroid} from 'react-native';
import RNTextDetector from "react-native-text-detector";
import Dimensions from './Dimensions';

export default class Ocr extends React.Component {

    constructor(props) {
      super(props);
      this.state = {textDetected: null};
  }

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

  takePicture = async () => {
    if (this.camera) {
      //const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync();
      console.log(data.uri);
      this.detectText(data.uri);
    }
  };

  detectText = async (uri) =>
  {
    console.log('OK !!');
    //uri = uri.replace('file://', '');
    const visionResp = await RNTextDetector.detectFromUri(uri);
    console.log('visionResp', visionResp);
    if(visionResp !== []) this.setState({textDetected: visionResp});
    else this.setState({textDetected: [{text: ""}]});
  }

  displayText(tabText) {
    let res = "";
    for (const e of tabText) {
      res += (e.text + "\n");
    }
    return res;
  }

  render() {
    const {textDetected} = this.state;
    console.log(textDetected);
    /*Toast.show({
      text: textDetected.shift().text,
      buttonText: "Go",
      duration: 5000,
      position: "top"
    })*/
    if(this.state.textDetected) alert(this.displayText(textDetected));
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
        <Title>{this.props.route.name}</Title>
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
});