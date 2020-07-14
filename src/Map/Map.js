import React, { Component } from 'react';
import MapView, {Marker, Callout} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Alert  } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, Input , Form, Item, Picker } from "native-base";
import Geolocation from '@react-native-community/geolocation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import { NativeRouter, Route, Redirect, Link, useHistory } from "react-router-native";
import axios from 'axios';
import Api from '../ApiData/ApiData';
import Details from './Details';

export class Map extends Component {
  constructor(props) {
    super(props);
    let test = [{heureDebut: "", heureFin: ""}]
    this.state = {
      apiData: {},
      region:
      {
        longitude: 2.3488,
        latitude: 48.8534,
        longitudeDelta: 0.04,
        latitudeDelta: 0.05
      },
      isLoading: true,
    };
  }
  
  async componentDidMount() {
    // Get location
    Geolocation.getCurrentPosition(
      (position) => {
          this.setState({
              region: {
                  longitude: position.coords.longitude,
                  latitude: position.coords.latitude,
                  longitudeDelta: 0.004,
                  latitudeDelta: 0.009
              }
          });
      },
      (error) => {
          console.log(error.code, error.message);
          throw error;
      },
      { 
          showLocationDialog: true,
          forceRequestLocation: true, 
          enableHighAccuracy: true, 
          timeout: 15000, 
          maximumAge: 10000 
      }
    );
    // Get API data
    let apiResult = await Api.getAllData();
    this.setState({ apiData: apiResult.vehicles, isLoading: false });
  }

  createMarker() {
    let filterList = {}
    let data = this.state.apiData
    if(this.props.route.params && this.props.route.params.filterList) filterList = this.props.route.params.filterList
    if(!this.state.isLoading) {
      data = this.state.apiData

      for (const field in filterList) {
        data = data.filter(v => filterList[field]["operator"] === "=" ? v[field] === filterList[field]["value"] : v[field].includes(filterList[field]["value"]))
      }
      if(this.props.route.params && this.props.route.params.filterList) this.props.route.params.filterList = {}

      let i = 0;
      return data.map(v =>
        (v.dLocLati && v.dLocLongi) && 
        (
          <CustomMarker props={this.props} id={i++} coordinate = {{latitude: Number(v.dLocLati), longitude: Number(v.dLocLongi)}} data={v}/>)
      )
    }
    else return (null)
  }

  render() {    
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Carte</Title>
          </Body>
          <Right/>
        </Header>
        <Content>
          <MapView 
            region={this.state.region}
            style={styles.mapStyle}
            showsUserLocation={ true } 
          >
          { !this.state.isLoading && this.createMarker() }
          </MapView>
        </Content>
      </Container>
    );
  }
}

export class CustomMarker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      planning: null,
      loading: true,
      details: false
    }
  }

   async getData() {
    let planning = await (await Api.getVehiclePlanning(this.props.data.matRef)).data;
    this.props.props.navigation.navigate('Details', {
      data: this.props.data,
      planning: planning
     })
  }

  /*linkPlanning(planning) {
    let i = 0
    let dateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString().substr(0,19).replace('T', ' ');
    let date = dateTime.split(' ')[0]
    let time = dateTime.split(' ')[1].split(':').slice(0,-1).join(':')
    for(const p of planning) {
      if(date === p.date.split('T'[0]) && (time >= p.heureDebut.replace("h",":") && time < p.heureFin.replace("h",":"))) {
        Object.assign(this.props.data, {heureDebut: p.heureDebut.replace("h",":"), heureFin: p.heureFin.replace("h",":")})
        console.log("ok")
      }
      else {
        Object.assign(this.props.data, {heureDebut: "N/A", heureFin: "N/A"})
      }
    }
  }*/
  

  render() {
    return (
      <Marker key={this.state.heureDebut && this.props.id } coordinate = {{latitude: Number(this.props.data.dLocLati), longitude: Number(this.props.data.dLocLongi)}}
        planning={this.state.heureDebut}    
        pinColor = {this.props.data.isDisponible ? "green" : "red"}
        ref={ref => { this.marker = ref; }}
        tracksViewChanges={true}
        onCalloutPress={() => {this.getData()}
      }
      >
      <Callout>
      <View>
        <Text>{"Référence: "+this.props.data.matRef}</Text>
        <Text>{"Equipement: "+this.props.data.matLibelle}</Text>
        <Text>{"Statut: "+this.props.data.sLocStatus}</Text>
        <Text>{"Location chauffeur: "+(this.props.data.matChauffeur.trim() === "" ? "Sans chauffeur" : this.props.data.matChauffeur)}</Text>
        <Text>{"Client: "+this.props.data.cliRef}</Text>
        <View style={styles.button}>
        <Button primary rounded success title="Details">
          <Text style={{color: "white", textAlign: "center", width: 100}}>Details</Text>
        </Button>
        </View>
      </View>
        </Callout>
      </Marker>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  button: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 5
  },
});

class FilterMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sLocStatus: undefined,
      matLibelle: undefined
    };
    this.filterList = {}
  }
  
 
  onValueChange2(key, operator, value) {
    this.setState({
    [key]: value
    })
    if(value.trim() === "") {
      if(this.filterList[key]) delete this.filterList[key]
    }
    else Object.assign(this.filterList, {[key]: {value: value, operator: operator}})
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.openDrawer()}
            >
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>Filtres</Title>
          </Body>
          <Right/>
        </Header>
        <Content>
          <Form>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.sLocStatus}
                  onValueChange={this.onValueChange2.bind(this, "sLocStatus", "=")}
                >
                  <Picker.Item label="Aucun" value="" />
                  <Picker.Item label="Arrêt" value="Arrêt" />
                  <Picker.Item label="Moteur tournant" value="Moteur tournant" />
                  <Picker.Item label="Immobilisation" value="Immobilisation" />
                  <Picker.Item label="Conduite" value="Conduite" />
                </Picker>
              </Item>
              <Item style={{paddingLeft: 3, marginLeft: 0}}>
                <Input 
                placeholder="Type" 
                onChangeText={this.onValueChange2.bind(this, "matLibelle", "~=")}
                />
              </Item>
              
            </Form>
            <View style={{alignItems: "center", padding: 30}}>
            <Button
              primary
              rounded
              title="Submit"
              onPress={() => {
                /* 1. Navigate to the Details route with params */
                this.props.navigation.navigate('Map', {
                  filterList: this.filterList,
               });
              }}
            >
            <Text style={{color: "white", textAlign: "center", fontSize: 16, width: 135}}>Filtrer</Text>
            </Button>
            </View>
        </Content>
      </Container>
    );
  }
}

const Tab = createBottomTabNavigator();

export default class HomeMap extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Tab.Navigator
        initialRouteName="Home"
        activeColor="#f0edf6"
        inactiveColor="#3e2465"
        barStyle={{ backgroundColor: '#694fad' }}
      >
        <Tab.Screen name="Map" component={Map} options={{
          tabBarLabel: 'Carte',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="map" color={color} size={26} />
          ),
        }} />
        <Tab.Screen name="Details" component={Details} options={{
          tabBarLabel: 'Details',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="information" color={color} size={26} />
          ),
        }}/>
        <Tab.Screen name="Filter" component={FilterMap} options={{
          tabBarLabel: 'Filtres',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="tune" color={color} size={26} />
          ),
        }}/>
      </Tab.Navigator>
    );
  }
}