import * as React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem } from "native-base";
import RNTesseractOcr from 'react-native-tesseract-ocr';
import {PermissionsAndroid} from 'react-native';
import RNTextDetector from "react-native-text-detector";

export default class Ocr extends React.Component {

  requestRWPermissions= async ()=> {
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
        <Title>{this.props.route.name}</Title>
      </Body>
      <Right />
    </Header>
      <View style={styles.container}>
        <RNCamera
          style={{ flex: 1, alignItems: 'center' }}
          ref={ref => {
            this.camera = ref
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.requestRWPermissions.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
      </Container>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  }
})