import React, { Component } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem } from "native-base";

export default class Map extends Component {
  // Probably best
  createMarker(data) {
    let i = 0;
    return data.map(v =>
      (v.dLocLati && v.dLocLongi) && 
      (<Marker key={i++} coordinate = {{latitude: Number(v.dLocLati), longitude: Number(v.dLocLongi)}}
        pinColor = {"red"}
        title={v.iVehId}
        description={v.sLocStatus}/>)
    )
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
