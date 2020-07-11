import React from 'react';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, Form, Item, Picker } from "native-base";
import { NativeRouter, Route, Redirect, Link, useHistory, withRouter  } from "react-router-native";

export default function Details(props) {
    let dateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString().substr(0,19).replace('T', ' ');
    let date = dateTime.split(' ')[0]
    let data = {}
    let planning = {}
    let planningToday = {}
    if(props.route.params && props.route.params.planning) planning = props.route.params.planning
    if(props.route.params && props.route.params.data) data = props.route.params.data
    console.log(planning)

    function getTodayPlanning() {
        for(const p of planning) {
            if("2020-02-21" === p.date.split('T')[0]) {
                planningToday = p
            }
        }
    }
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    function displayVehicleDetails() {
        console.log("-------------------data---------------------")
        console.log(data)
        console.log("--------------------------------------------")
        console.log("-------------------planning---------------------")
        console.log(planning)
        console.log("--------------------------------------------")
        let details = []
        if(!isEmpty(planning) && !isEmpty(data) !== {}) {
            getTodayPlanning()
            console.log(planningToday)
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
                <Text>Longueur du véhicule: {data.matLongueur}</Text>,
                <Text>Largeur du véhicule: {data.matLargeur}</Text>,
                <Text>Hauteur du véhicule: {data.matHauteur}</Text>,
                <Text>Poid du véhicule: {data.matPoids}</Text>,
                <Text>Remarque: {data.remarque}</Text>
        )
        details.push(<Text>{"\n"}</Text>)
        details.push(<Text style={{fontWeight: "bold", fontSize: 15}}>Planning: </Text>)
        details.push(<Text>{"\n"}</Text>)
        if(planningToday !== {}) {
                for(let key in planningToday) {
                    details.push(<Text>{key}: {planningToday[key]}</Text>)
                }
            }
            else details.push(<Text>Pas de planning disponible à cette date</Text>)
        } else {
            console.log("ok")
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
            <Title>Details</Title>
            </Body>
        <Right />
      </Header>
      <Content>
          <View style={{padding: 8, paddingTop: 20}}>
            {displayVehicleDetails()}
            <View style={styles.button}>
                <Button primary rounded success title="Details" onPress={() => props.navigation.navigate('Map')}>
                    <Text style={{color: "white", textAlign: "center", width: 100}}>Revenir à la carte</Text>
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
      paddingTop: 20,
      paddingBottom: 5
    },
  });