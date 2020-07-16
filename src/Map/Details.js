import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content} from "native-base";
import MyPicker from '../Picker/Picker'
import Planning from '../Planning/Planning'

export default function Details(props) {
    let data = {}
    let planning = {}
    let photos = {}
    if(props.route.params && props.route.params.planning) planning = props.route.params.planning
    if(props.route.params && props.route.params.data) data = props.route.params.data
    if(props.route.params && props.route.params.photos) photos = props.route.params.photos

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    // Display all the details page of the vehicle
    function displayVehicleDetails() {
        let details = []
        if(!isEmpty(data)) {
            details.push(<Text style={{fontWeight: "bold", fontSize: 15}}>Informations du véhicule:</Text>,
                <Text>{"\n"}</Text>,
                <Text>Référence: {data.matRef}</Text>,
                <Text>Equipement: {data.matLibelle}</Text>,
                <Text>Statut: {data.sLocStatus}</Text>,
                <Text>Plaque d'immatriculation: {data.matImatriculation}</Text>,
                <Text>Compteur d’heures de fonctionnement en minutes: {data.dNbHours}</Text>,
                <Text>Compteur kilométrique du véhicule en KM: {data.dKM}</Text>,
                <Text>Date de début de validité du véhicule: {data.dtValidStart}</Text>,
                <Text>Date de fin de validité du véhicule: {data.dtValidEnd}</Text>,
                <Text>Numéro de série: {data.matNumSerie}</Text>,
                <Text>Longueur du véhicule: {data.matLongueur}</Text>,
                <Text>Largeur du véhicule: {data.matLargeur}</Text>,
                <Text>Hauteur du véhicule: {data.matHauteur}</Text>,
                <Text>Poid du véhicule: {data.matPoids}</Text>,
                <Text>Remarque: {data.remarque}</Text>
            )
            details.push(<Text>{"\n"}</Text>)
            details.push(<Text style={{fontWeight: "bold", fontSize: 15}}>Planning: </Text>)
            details.push(<Text>{"\n"}</Text>)
            details.push(<Planning planning={planning}/>)
            details.push(<Text>{"\n"}</Text>)
            details.push(<Text style={{fontWeight: "bold", fontSize: 15}}>Envoyer une photo:</Text>)
            details.push(<MyPicker idV={data.matRef} photos={photos}/>)
        } else {
            details.push(<View style={{alignItems: 'center'}}><Text style={{fontSize: 15}}>Aucun véhicule sélectionné</Text></View>)
        }
        return details
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
            <Title>Véhicule</Title>
            </Body>
        <Right />
      </Header>
      <Content>
          <View style={{padding: 8, paddingTop: 20}}>
            {displayVehicleDetails()}
            <View style={styles.button}>
                <Button rounded dark title="Details" onPress={() => props.navigation.navigate('Map')}>
                    <Text style={{color: "white", textAlign: "center", width: 135, fontSize: 15}}>Revenir à la carte</Text>
                </Button>
            </View>
          </View>
    </Content>
        </Container>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    button: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 30,
      paddingBottom: 5
    },
  });