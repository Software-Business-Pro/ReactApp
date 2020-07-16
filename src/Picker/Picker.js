import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Button, Toast } from "native-base";
import Api from '../ApiData/ApiData'

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

export default class MyPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
      imageChose: false,
      successUpload: null,
      photos: {}
    };
  }

  // Display vehicle's photos
  displayPhotos() {
    let res = []
    let i = 0
    let photos = {}
    if(!isEmpty(this.state.photos)) photos = this.state.photos
    else photos = this.props.photos
    res = photos.map(p => <Image key={i++} style={{width: 100, height: 100}} source={{
      uri: p.lienImage,
    }}/>)
    this.state.photos = {}
    this.state.successUpload = null
    return res
  }
  // Allow to choose a picture from gallery or take one
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

  // Send image to the vehicles database via our api
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
          Api.GetVehiclesPhotos(this.props.idV).then(res => {
            const photos = res.data;
            this.setState({photos, successUpload: true, imageChose: false, filePath: {}})
          })
        }
    }
      xhr.open('POST', "https://sbpesgi.azurewebsites.net/Api/SBP/Image/"+this.props.idV);
      xhr.send(body);
    }
  }

  render() {
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
      <>
        <View style={styles.container}>
            {!isEmpty(this.state.filePath) && !this.state.successUpload && <Image
                source={{ uri: this.state.filePath.uri }}
                style={{ width: 250, height: 250 }}
            />}
            <Text style={{ alignItems: 'center' }}>
            </Text>
            <Button rounded title="Choose File" onPress={this.chooseFile.bind(this)} style={{marginBottom: 10}}>
                <Text style={{color: "white", textAlign: "center", fontSize: 15, width: 135}}>Choisir la photo</Text>
            </Button>
            {this.state.imageChose && !this.state.successUpload && (<Button primary rounded success title="Send File" onPress={() => this.sendImage()}>
                <Text style={{color: "white", textAlign: "center", fontSize: 15, width: 135}}>Envoyer la photo</Text>
            </Button>)}
            <Text>{"\n"}</Text>
        </View>
        <View style={{flex: 1}}>
        <Text style={{fontWeight: "bold", fontSize: 15}}>Gallerie: </Text>
        {this.displayPhotos()}
        </View>
      </>
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