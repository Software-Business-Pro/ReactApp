import React from 'react';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import BuildConfig from "react-native-config";

// Return a tab of list of all Tag found with attributes: name, attributes, value, children
function parseXml(xml, element) {
  var xml = new XMLParser().parseFromString(xml);
  return xml.getElementsByTagName(element);
}

// Take result of parseXml and return a tab of key value list with name => value
function formatXml(xmlParsed) {
  let allChild = xmlParsed.map(x => x.children);
  let res = [];
  for (const e of allChild) {
    let a = {};
    for (const f of e) {
      a[f.name] = f.value;
    }
    res.push(a);
  }
  return res;
}

// Get data from SOAP API, our API and link datas
class ApiData {
  // Link vehicles with details informations about them
  linkVehicles(vehiclesData, vehiclesDetailsData) {
    let res = []
    for(const v of vehiclesData) {
      for(const vd of vehiclesDetailsData) {
        if(v.sName === vd.matRef) {
          res.push(Object.assign(v, vd))
        }
      }
    }
    return res;
  }

  // Methode trop longue =>  abandonnée
  async linkPlanning(allLinkedVehicles) {
    let dateTime = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString().substr(0,19).replace('T', ' ');
    let date = dateTime.split(' ')[0]
    let time = dateTime.split(' ')[1].split(':').slice(0,-1).join('h')
    let i = 0
    for(const v of allLinkedVehicles) {
      let planning = await this.getVehiclePlanning(v.sName);
      if(planning.data) {
        for(const p of planning.data) {
          if(date === p.date.split('T'[0]) && (time >= p.heureDebut && time < p.heureFin)) {
            Object.assign(v, {heureDebut: p.heureDebut.replace("h",":"), heureFin: p.heureFin.replace("h",":")})
            i++
          }
        }
      }
    }
    console.log("Longueur :"+i)
    return allLinkedVehicles;
  }

  async getAllData() {
    // Ask for session
    const resSession = await this.getSession();
    let sessionRes = formatXml(parseXml(resSession, "GetSessionResult"));
    let allVehicles = [];
    let allLinkedVehicles = [];
    // Get the session
    const iUserId = sessionRes[0]['iUserId'];
    const iSessionId = sessionRes[0]['iSessionId'];
    const iAccountId = sessionRes[0]['iAccountId'];
    
    if(sessionRes.length === 1 && iUserId && iSessionId && iAccountId) {
      // Get all the vehicles
      const resVehicles = await this.GetVehicles(iUserId, iSessionId, iAccountId);
      allVehicles = formatXml(parseXml(resVehicles, "CNTVehicle"));
      // Get the drivers
      let vehiclesDetails = await (await this.GetVehiclesDetails()).data;
      allLinkedVehicles = this.linkVehicles(allVehicles, vehiclesDetails)
    }
    else
    {
      console.log('Erreur session');
    }
    return {vehicles : allLinkedVehicles};
  }
  // SOAP request for session
  async getSession() {
    let xmls = '<?xml version="1.0" encoding="utf-8"?>\
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
      <soap:Body>\
        <GetSession xmlns="http://tempuri.org/">\
          <_sAccount>'+BuildConfig.API_HERMES_ACCOUNT+'</_sAccount>\
          <_sLogin>'+BuildConfig.API_HERMES_LOGIN+'</_sLogin>\
          <_sPassword>'+BuildConfig.API_HERMES_PWD+'</_sPassword>\
        </GetSession>\
      </soap:Body>\
    </soap:Envelope>';

   const result = axios.post('http://webservices.hermesapps.com/ws_connect.asmx',
              xmls,
              {headers:
                    {
                        'Content-Type': 'text/xml; charset=utf-8',
                        SOAPAction: 'http://tempuri.org/GetSession'
                    }
              }).then(res=>{
                return res.data;
              }).catch(err=>{
                return err;
              });
    return (result);
  }
  // SOAP request for vehicles
  async GetVehicles(iUserId, iSessionId, iAccountId) {
    let xmls = '<?xml version="1.0" encoding="utf-8"?>\
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
      <soap:Body>\
        <GetVehicles xmlns="http://tempuri.org/">\
          <_session>\
            <iUserId>'+iUserId+'</iUserId>\
            <iSessionId>'+iSessionId+'</iSessionId>\
            <iAccountId>'+iAccountId+'</iAccountId>\
          </_session>\
        </GetVehicles>\
      </soap:Body>\
    </soap:Envelope>';

    const result = axios.post('http://webservices.hermesapps.com/ws_connect.asmx',
        xmls,
        {headers:
              {
                  'Content-Type': 'text/xml; charset=utf-8',
                  SOAPAction: 'http://tempuri.org/GetVehicles'
              }
        }).then(res=>{
          return res.data;
        }).catch(err=>{
          return err;
        });
    return (result);
  }
  // SOAP request for the drivers
  async GetResources(iUserId, iSessionId, iAccountId) {
    let xmls = '<?xml version="1.0" encoding="utf-8"?>\
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
      <soap:Body>\
        <GetResources xmlns="http://tempuri.org/">\
          <_session>\
            <iUserId>'+iUserId+'</iUserId>\
            <iSessionId>'+iSessionId+'</iSessionId>\
            <iAccountId>'+iAccountId+'</iAccountId>\
          </_session>\
        </GetResources>\
      </soap:Body>\
    </soap:Envelope>';

    const result = axios.post('http://webservices.hermesapps.com/ws_connect.asmx',
        xmls,
        {headers:
              {
                  'Content-Type': 'text/xml; charset=utf-8',
                  SOAPAction: 'http://tempuri.org/GetResources'
              }
        }).then(res=>{
          return res.data;
        }).catch(err=>{
          return err;
        });
    return (result);
  }

  async GetVehiclesDetails() {
    return axios.get('https://sbpesgi.azurewebsites.net/Api/SBP/Vehicule')
  }

  async getVehiclePlanning(id) {
    return axios.get('https://sbpesgi.azurewebsites.net//Api/SBP/Planning/'+id)
 }

}

const Api = new ApiData();
export default Api;