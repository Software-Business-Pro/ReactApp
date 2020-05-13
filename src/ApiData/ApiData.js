import React from 'react';
import axios from 'axios';
import XMLParser from 'react-xml-parser';
import BuildConfig from "react-native-config";

function parseXml(xml, element) {
  var xml = new XMLParser().parseFromString(xml);
  return xml.getElementsByTagName(element);
}

// Get data from SOAP API
class ApiData {

  async getAllData() {
    // Ask for session
    const resSession = await this.getSession();
    //console.log(resSession);

    const iUserId = parseXml(resSession, "iUserId").shift().value;
    const iSessionId = parseXml(resSession, "iSessionId").shift().value;
    const iAccountId = parseXml(resSession, "iAccountId").shift().value;

    if(iUserId && iAccountId && iAccountId) {
      console.log("iUserId : " + iUserId);
      console.log("iSessionId : " + iSessionId);
      console.log("iAccountId : " + iAccountId);
    }
    else
    {
      console.log('Erreur session');
    }
    return resSession;
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
} 

const Api = new ApiData();
export default Api;