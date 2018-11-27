import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
var Speech = require('react-native-speech');

const BEST_MATCH_THRESHOLD = 0.6;

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

    return;

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

    if (this.state.bestMatch) {
      if (this.state.bestMatch && this.state.bestMatch.identifier && this.state.bestMatch.identifier === "hotdog") {
        classification = classification.identifier;

          Speech.speak({
             text: classification.identifier,
             voice: 'en-US'
           })
           .then(started => {
             console.log('Speech started');
           })
           .catch(error => {
             console.log('You\'ve already started a speech instance.');
           });

      }
//       else {
//         classification = "Not hot dog";
//       }
    }

    return (
      <View style={styles.container}>
        <CoreMLImage modelFile="DollarBillModel" onClassification={(evt) => this.onClassification(evt)}>
          <View style={styles.container}>
            <Text key={classification.identifier} style={styles.info}>classification</Text>
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
