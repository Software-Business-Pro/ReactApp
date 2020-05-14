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

// Get data from SOAP API
class ApiData {

  async getAllData() {
    // Ask for session
    const resSession = await this.getSession();
    //console.log(resSession);
    let sessionRes = formatXml(parseXml(resSession, "GetSessionResult"));
    let allVehicles = [];
    const iUserId = sessionRes[0]['iUserId'];
    const iSessionId = sessionRes[0]['iSessionId'];
    const iAccountId = sessionRes[0]['iAccountId'];
    
    if(sessionRes.length === 1 && iUserId && iSessionId && iAccountId) {
      console.log('-------------------Session OK----------------');
      console.log("iUserId : " + iUserId);
      console.log("iSessionId : " + iSessionId);
      console.log("iAccountId : " + iAccountId);

      const resVehicles = await this.GetVehicles(iUserId, iSessionId, iAccountId);
      allVehicles = formatXml(parseXml(resVehicles, "CNTVehicle"));
      //console.log(allVehicles);
    }
    else
    {
      console.log('Erreur session');
    }
    return {vehicles : allVehicles};
  }

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

  

} 

const Api = new ApiData();
export default Api;