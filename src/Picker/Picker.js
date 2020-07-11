import React from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, Form, Item, Picker } from "native-base";

export default class Pickertest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: {},
      imageChose: false
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
      console.log('Response = ', response);

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
    //console.log(this.state.filePath)
    const formData = new FormData();
    
    formData.append('file', this.state.filePath, "test");

    axios.post('https://sbpesgi.azurewebsites.net/Api/SBP/Image/P774', formData)
      .then((response) => {
        //console.log(response)
        })
      .catch((err) => {
        //console.log(err)
      })
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
            <Content style={this.state.imageChose && {marginTop: 50}}>
                <View style={styles.container}>
                    <View style={styles.container}>
                        <Image
                            source={{ uri: this.state.filePath.uri }}
                            style={{ width: 250, height: 250 }}
                        />
                        <Text style={{ alignItems: 'center' }}>
                            {this.state.filePath.uri}
                        </Text>
                        <Button rounded title="Choose File" onPress={this.chooseFile.bind(this)} style={{marginBottom: 10}}>
                            <Text style={{color: "white", textAlign: "center", fontSize: 16, width: 135}}>Choisir la photo</Text>
                        </Button>
                        {this.state.imageChose && (<Button primary rounded success title="Send File" onPress={() => this.sendImage()}>
                            <Text style={{color: "white", textAlign: "center", fontSize: 16, width: 135}}>Envoyer la photo</Text>
                        </Button>)}
                    </View>
                </View>
            </Content>
        </Container>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});