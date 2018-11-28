import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
let Speech = require('react-native-speech');
let Vibration = require('react-native-vibration');


const BEST_MATCH_THRESHOLD = 0.8;

import CoreMLImage from "react-native-core-ml-image";

export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      bestMatch: null,
      classifications: []
    };
  }

  onClassification(classifications) {
    let bestMatch = null;

    this.setState({ classifications });

    if (classifications && classifications.length > 0) {
      // Loop through all of the classifications and find the best match
      // this.setState({ classifications });
      classifications.forEach((classification) => {
        if (!bestMatch) {
          bestMatch = classification;
        }
        else if (classification.confidence > bestMatch.confidence) {
          bestMatch = classification;
        }
      });

      // Is best match confidence better than our threshold?
      if (bestMatch.confidence >= BEST_MATCH_THRESHOLD) {
        this.setState({ bestMatch: bestMatch });
      } else {
        this.setState({ bestMatch: null });
      }

    } else {
      this.setState({ bestMatch: null });
    }

  }


  render() {
    let classification = null;
    let { classifications } = this.state || [];
    let { bestMatch } = this.state;
    let money = "";

    if (bestMatch && bestMatch.identifier && bestMatch.identifier === "1") {
      classification = "One";
      money = classification + " dollar";

    }
    else if (bestMatch && bestMatch.identifier && bestMatch.identifier === "5") {
      classification = "Five";
      money = classification + " dollars";
    }
    else if (bestMatch && bestMatch.identifier && bestMatch.identifier === "10") {
      classification = "Ten";
      money = classification + " dollars";
    }
    else if (bestMatch && bestMatch.identifier && bestMatch.identifier === "20") {
      classification = "Twenty";
      money = classification + " dollars";
    }
    else {
      classification = "NOT DOLLAR BILL";
    }
    if (classification !== "NOT DOLLAR BILL") {
      Speech.speak({
        text: money,
        voice: 'en-UK'
      }).then(started => {
        console.log('Speech started');
      }).catch(error => {
        console.log('You\'ve already started a speech instance.');
      });
    }
    return (
      <View style={styles.container}>
        <CoreMLImage modelFile="DollarBillModel" onClassification={(evt) => this.onClassification(evt)}>
          <View style={styles.container}>
            <Text style={styles.info}>{money}</Text>
          </View>
        </CoreMLImage>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  info: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: 'center',
    fontWeight: "900",
    margin: 10,
  }
});
