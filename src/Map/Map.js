import React, { Component } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem } from "native-base";

export default class Map extends Component {
  
  createMarker(data) {
    let markers = [];
    let i = 0;
    for (const vehicle of data) {
      if(vehicle.dLocLati &&  vehicle.dLocLongi) {
        markers.push(<Marker key={i} coordinate = {{latitude: Number(vehicle.dLocLati), longitude: Number(vehicle.dLocLongi)}}
        pinColor = {"red"}
        title={vehicle.iVehId}
        description={vehicle.sLocStatus}/>);
        i++;
      }
    }
    return markers;
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
        <Content>
          <MapView style={styles.mapStyle}>
          { this.createMarker(this.props.apiData) }
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
