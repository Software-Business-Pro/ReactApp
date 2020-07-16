import React, { Component, PureComponent } from 'react';
import MapView, {Marker, Callout} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Input , Form, Item, Picker } from "native-base";
import Geolocation from '@react-native-community/geolocation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Api from '../ApiData/ApiData';
import Details from './Details';

export class Map extends PureComponent {

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
      isLoading: true
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
                  longitudeDelta: 0.4,
                  latitudeDelta: 0.9
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
    this.setState({ apiData: apiResult.vehicles, isLoading: false});
  }
  // Function for filter with no casse
  filterNoCasse(vf, v, operator) {
    if(typeof vf === "string"){
      vf = vf.toLowerCase()
      v = v.toLowerCase()
    }
    if(operator === "=") {
      return v === vf
    }
    else {
      return v.includes(vf)
    }
  }
  // Generate all vehicle's marker on map
  createMarker() {
    let filterList = {}
    let data = this.state.apiData
    if(this.props.route.params && this.props.route.params.filterList) filterList = this.props.route.params.filterList
      // Filters
      for (const field in filterList) {
        data = data.filter(v => this.filterNoCasse(filterList[field]["value"], v[field], filterList[field]["operator"]))
      }
      if(this.props.route.params && this.props.route.params.filterList) this.props.route.params.filterList = {}

      let i = 0;
      return data.map(v =>
      (v.dLocLati && v.dLocLongi) && 
      (
        <CustomMarker props={this.props} id={i++} coordinate = {{latitude: Number(v.dLocLati), longitude: Number(v.dLocLongi)}} data={v}/>)
      )
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
          <Right>
            <Button 
              transparent
              onPress={() => {this.componentDidMount()}}
            >
              <Icon name='refresh' />
            </Button>
          </Right>
        </Header>
        <Content>
          {this.state.isLoading  ?  <View style={[styles.container, styles.horizontal, {marginTop: Dimensions.get('window').height/2-40}]}><ActivityIndicator size="large" style={styles.ActivityIndicator}/></View> :
          (<MapView 
            region={this.state.region}
            style={styles.mapStyle}
            showsUserLocation={true}
            tracksViewChanges={false}
          >
          {this.createMarker()}
          </MapView>)}
        </Content>
      </Container>
    );
  }
}

export class CustomMarker extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      planning: null,
      loading: true,
      details: false
    }
  }
  // Get planning and photos of vehicle
   async getData() {
    let planning = await (await Api.getVehiclePlanning(this.props.data.matRef)).data;
    let photos = await (await Api.GetVehiclesPhotos(this.props.data.matRef)).data;
    this.props.props.navigation.navigate('Details', {
      data: this.props.data,
      planning: planning,
      photos: photos
     })
  }
  
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
        <Text>{"Ville: "+(this.props.data.sLocLocality.trim() === "" ? "Inconnue" : this.props.data.sLocLocality + " - " + (this.props.data.sLocZipCode.trim() === "" ? "Code postal inconnu" : this.props.data.sLocZipCode ))}</Text>
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
  horizontal: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10
  },
  activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
 }
});

class FilterMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sLocStatus: undefined,
      isDisponible: undefined,
      matLibelle: undefined
    };
    this.filterList = {}
  }
  
 // Create an object to filter vehicles on map
  onValueChange(key, operator, value) {
    this.setState({
    [key]: value
    })

    if(typeof value === "string") {
      if(value.trim() === "") {
        if(this.filterList[key]) delete this.filterList[key]
      }
      else Object.assign(this.filterList, {[key]: {value: value, operator: operator}})
    }
    else {
      Object.assign(this.filterList, {[key]: {value: value, operator: operator}})
    }
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
                  onValueChange={this.onValueChange.bind(this, "sLocStatus", "=")}
                >
                  <Picker.Item label="Choisir un statut" value="" />
                  <Picker.Item label="Arrêt" value="Arrêt" />
                  <Picker.Item label="Moteur tournant" value="Moteur tournant" />
                  <Picker.Item label="Immobilisation" value="Immobilisation" />
                  <Picker.Item label="Conduite" value="Conduite" />
                </Picker>
              </Item>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.isDisponible}
                  onValueChange={this.onValueChange.bind(this, "isDisponible", "=")}
                >
                  <Picker.Item label="Choisir une disponibilité" value="" />
                  <Picker.Item label="Disponible" value={true} />
                  <Picker.Item label="Indisponible" value={false} />
                </Picker>
              </Item>
              <Item style={{paddingLeft: 3, marginLeft: 0}}>
                <Input 
                placeholder="Type" 
                onChangeText={this.onValueChange.bind(this, "matLibelle", "~=")}
                />
              </Item>
              <Item style={{paddingLeft: 3, marginLeft: 0}}>
                <Input 
                placeholder="Référence" 
                onChangeText={this.onValueChange.bind(this, "matRef", "~=")}
                />
              </Item>
              <Item style={{paddingLeft: 3, marginLeft: 0}}>
                <Input 
                placeholder="Immatriculation" 
                onChangeText={this.onValueChange.bind(this, "matImatriculation", "~=")}
                />
              </Item>
              <Item style={{paddingLeft: 3, marginLeft: 0}}>
                <Input 
                placeholder="Code postale" 
                onChangeText={this.onValueChange.bind(this, "sLocZipCode", "~=")}
                />
              </Item>
              <Item style={{paddingLeft: 3, marginLeft: 0}}>
                <Input 
                placeholder="Numéro de série" 
                onChangeText={this.onValueChange.bind(this, "matNumSerie", "~=")}
                />
              </Item>
            </Form>
            <View style={{alignItems: "center", padding: 30}}>
            <Button
              primary
              rounded
              title="Submit"
              onPress={() => {
                /* Navigate to the Details route with params */
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
// BottomTab menu for map
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
        <Tab.Screen name="Filter" component={FilterMap} options={{
          tabBarLabel: 'Filtres',
          tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="tune" color={color} size={26} />
          ),
        }}/>
        <Tab.Screen name="Details" component={Details} options={{
          tabBarLabel: 'Véhicule',
          tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="information" color={color} size={26} />
          ),
        }}/>
      </Tab.Navigator>
    );
  }
}