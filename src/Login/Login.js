import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { firebase } from '@react-native-firebase/auth';
import { Redirect } from "react-router-native";
import { Container,Toast } from "native-base";

export default class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      email:"",
      password:"",
      redirection: false,
      error: null
    }
  }
  // Handle firebase login
  Login = (event) => {
    if(this.state.email.trim() !== '' && this.state.password.trim() !== '')
    {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          this.setState({ user });
        })
        .catch(error => {
          this.setState({ error });
        });
      }
      else
      {
        this.setState({error: "Veuillez renseigner l'email et le mot de passe"})
      }
  };

  render(){
      if(this.state.error) {
        Toast.show({
          text: this.state.error.toString(),
          buttonText: "OK",
          duration: 5000,
          position: "bottom",
          type: "danger"
        })
          this.setState({error: null})
      }
    return (
      <Container>
        <View style={styles.container}>
          <Text style={styles.logo}>Software Business Pro</Text>
          <View style={styles.inputView} >
            <TextInput  
              style={styles.inputText}
              placeholder="Email..." 
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({email:text})}/>
          </View>
          <View style={styles.inputView} >
            <TextInput  
              secureTextEntry
              style={styles.inputText}
              placeholder="Mot de passe..." 
              placeholderTextColor="#003f5c"
              onChangeText={text => this.setState({password:text})}/>
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={this.Login} >
            <Text style={styles.loginText}>Connexion</Text>
          </TouchableOpacity>
          {(this.state.user) && <Redirect to={{
              pathname: '/app',
              state: { user: this.state.user}
          }}/>}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#694fad',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:35,
    color:"#ffff",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#ffff",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"black"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#5cb85c",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});