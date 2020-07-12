import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Button, Toast } from "native-base";


function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default class MyPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
      imageChose: false,
      successUpload: null
    };
  }
  chooseFile = () => {
    var options = {
      title: 'Sélectionez une image',
      takePhotoButtonTitle: 'Prendre une photo',
      chooseFromLibraryButtonTitle: 'Importer de la gallerie',
      cancelButtonTitle: 'Annuler',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        this.setState({
            filePath: source,
            imageChose: true
        });
      }
    });
  };

  sendImage() {
    if(!isEmpty(this.props.idV)) {
      var file = {
        uri: this.state.filePath.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      };
      
      var body = new FormData();
      body.append('file', file);
      
      var xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log("ok")
            this.setState({successUpload: true})
        }
    }
      xhr.open('POST', "https://sbpesgi.azurewebsites.net/Api/SBP/Image/"+this.props.idV);
      xhr.send(body);
    }
  }

  render() {
    console.log("test: "+this.state.successUpload)
    if(this.state.successUpload !== null)
      if(this.state.successUpload) {
        Toast.show({
          text: "L'image a correctement été envoyé",
          buttonText: "OK",
          duration: 5000,
          position: "bottom",
          type: "success"
        })
      }
      else {
        Toast.show({
          text: "Une erreur a été rencontré lors de l'envoi de l'image",
          buttonText: "OK",
          duration: 5000,
          position: "bottom",
          type: "danger"
        })
      }
    return (
          <View style={styles.container}>
              {!isEmpty(this.state.filePath) && <Image
                  source={{ uri: this.state.filePath.uri }}
                  style={{ width: 250, height: 250 }}
              />}
              <Text style={{ alignItems: 'center' }}>
              </Text>
              <Button rounded title="Choose File" onPress={this.chooseFile.bind(this)} style={{marginBottom: 10}}>
                  <Text style={{color: "white", textAlign: "center", fontSize: 15, width: 135}}>Choisir la photo</Text>
              </Button>
              {this.state.imageChose && (<Button primary rounded success title="Send File" onPress={() => this.sendImage()}>
                  <Text style={{color: "white", textAlign: "center", fontSize: 15, width: 135}}>Envoyer la photo</Text>
              </Button>)}
          </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10
  },
});