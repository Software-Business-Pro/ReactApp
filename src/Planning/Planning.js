import WeekView from 'react-native-week-view';
import { StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';


export default class Planning extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            selectedDate: new Date(),
          };
    }
 
// Take a ISOSDate string and return a date object
parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
// Generate a datetime object by string date and string hour
generateDates = (date, heure) => {
    const dater = this.parseISOString(date+"Z")
    dater.setHours(Number(heure.split(':')[0]), Number(heure.split(':')[1]), 0)
    return dater;
}
// Specific is empty string
isEmpty(s) {
    if(s === "" || s === "N/A") return true
    else return false
}

isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }

render() { 
    // Generate a tab of object for the vehicle's planning
    let planning = []   
    if(!this.isEmptyObject(this.props.planning)) {
        let i = 0
        for(const p of this.props.planning) {
            if(!this.isEmpty(p.heureDebut) && !this.isEmpty(p.heureFin)) {
                
                planning.push({id: i, description: "", startDate: this.generateDates(p.date, p.heureDebut), endDate: this.generateDates(p.date, p.heureFin), color: "red"})
                i++
            }
            else if((!this.isEmpty(p.heureDebutAM) && !this.isEmpty(p.heureFinAM)) || (!this.isEmpty(p.heureDebutPM) && !this.isEmpty(p.heureFinPM)))
            {
                planning.push({id: i, description: "", startDate: this.generateDates(p.date, p.heureDebutAM), endDate: this.generateDates(p.date, p.heureFinAM), color: "red"},
                        {id: i+1, description: "", startDate: this.generateDates(p.date, p.heureDebutPM), endDate: this.generateDates(p.date, p.heureFinPM), color: "red"})
                i+=2
            }
        }
    }
    else planning = [{id: 0}]
    return (
        <>
        <SafeAreaView style={styles.container}>
          <WeekView
            events={planning}
            selectedDate={this.state.selectedDate}
            numberOfDays={3}
            onEventPress={this.onEventPress}
            headerStyle={styles.headerStyle}
            headerTextColor="#fff"
            formatDateHeader="MMM D"
            hoursInDisplay={24}
            startHour={8}
          />
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingTop: 22,
        marginLeft: -8,
        marginRight: -8
    },
    headerStyle: {
        backgroundColor: '#4286f4',
    },
  });