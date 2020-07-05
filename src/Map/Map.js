import React, { Component } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, Form, Item, Picker } from "native-base";
import Geolocation from '@react-native-community/geolocation';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationEvents } from 'react-navigation';
import Api from '../ApiData/ApiData';

export class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      apiData: {},
      region:
      {
        longitude: 0,
        latitude: 0,
        longitudeDelta: 0.004,
        latitudeDelta: 0.009
      },
      isLoading: true
    };
  }

  async componentDidMount() {
    console.log("test")
    // Get data
    let apiResult = await Api.getAllData();
    this.setState({ apiData: apiResult.vehicles });
    this.setState({ isLoading: false });
    

    Geolocation.getCurrentPosition(
      (position) => {
          console.log(position);
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
          // See error code charts below.
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
  }

  // Probably best
  createMarker() {
    let filterList = "Aucun"
    let data = null
    if(this.props.route.params && this.props.route.params.filterList) filterList = this.props.route.params.filterList.slice(0,1)
    
    if(!this.state.isLoading) {
      data = this.state.apiData
      console.log(filterList)
      if(filterList == "Aucun") data = this.state.apiData
      else data = this.state.apiData.filter(v => v.sLocStatus == filterList)
      let i = 0;
      return data.map(v =>
        (v.dLocLati && v.dLocLongi) && 
        (<Marker key={i++} coordinate = {{latitude: Number(v.dLocLati), longitude: Number(v.dLocLongi)}}
          pinColor = {"red"}
          title={v.iVehId}
          description={v.sLocStatus}/>)
      )
    }
    else return (null)
  }

  render() {
    console.log(this.props.route.params)
    //console.log(this.state.apiData)
    
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
            <Title>{this.props.route.name}</Title>
          </Body>
          <Right>
            <Button 
              transparent
              onPress={() =>this.props.navigation.navigate('Ocr')}
            >
              <Icon name='options' />
            </Button>
          </Right>
        </Header>
        <Content>
          <MapView 
            region={this.state.region}
            style={styles.mapStyle}
            region = {this.state.region} 
            onRegionChange={ 
              region => {
                //console.log("Region Changed");
                //this.setState({region});
              } }
            onRegionChangeComplete={ 
              region => {
                //console.log("Region change complete");
                //this.setState({region});
              } }
            showsUserLocation={ true } 
          >
          { this.createMarker() }
          </MapView>
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
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

class FilterMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected2: undefined
    };
    let filterList = []
  }
  
 
  onValueChange2(value) {
    /*this.setState({
      selected2: value
    }, () => {console.log(this.state.selected2)
      this.state.selected2 == "Aucun" ? this.setState({data: this.props.apiData}) : this.setState({data: this.props.apiData.filter(v => v.sLocStatus == this.state.selected2)})});
    */
   this.setState({
    selected2: value
    })
    this.filterList = [value]
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
            <Title>{this.props.route.name}</Title>
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
                  placeholder="Select your SIM"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.selected2}
                  onValueChange={this.onValueChange2.bind(this)}
                >
                  <Picker.Item label="Aucun" value="Aucun" />
                  <Picker.Item label="Arrêt" value="Arrêt" />
                  <Picker.Item label="Moteur tournant" value="Moteur tournant" />
                  <Picker.Item label="Immobilisation" value="Immobilisation" />
                  <Picker.Item label="Conduite" value="Conduite" />
                </Picker>
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