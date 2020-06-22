import React, { Component } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { Container, Header, Title, Left, Icon, Right, Button, Body, Content, Card, CardItem, Form, Item, Picker } from "native-base";

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

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.apiData,
      selected2: undefined
    };
  }
  onValueChange2(value) {
    this.setState({
      selected2: value
    }, () => {console.log(this.state.selected2)
      this.state.selected2 == "Aucun" ? this.setState({data: this.props.apiData}) : this.setState({data: this.props.apiData.filter(v => v.sLocStatus == this.state.selected2)})});
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
          <MapView style={styles.mapStyle}>
          { this.createMarker(this.state.data) }
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
