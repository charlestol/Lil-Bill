import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
let Speech = require('react-native-speech');
let Vibration = require('react-native-vibration');


const BEST_MATCH_THRESHOLD = 0.98;

import CoreMLImage from "react-native-core-ml-image";

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now()
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
};

export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      bestMatch: null,
      classifications: []
    };
  }

  onClassification = throttle((classifications) => {
    console.log("executing in onClassification");
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

  }, 1000);


  render() {
    let classification = null;
    let { classifications } = this.state || [];
    let { bestMatch } = this.state;

    if (bestMatch && bestMatch.identifier) {
      switch(bestMatch.identifier) {
        case "1":
          classification = "One";
          // Vibration.vibrate();
          break;
        case "5":
          classification = "Five";
          // Vibration.vibrate(2);
          break;
        case "10":
          classification = "Ten";
          // Vibration.vibrate(3);
          break;
        case "20":
          classification = "Twenty";
          // Vibration.vibrate(4);
          break;
        default:
          break;
      }
    }
    else {
      classification = "NOT DOLLAR BILL";
    }
    if (classification !== "NOT DOLLAR BILL") {
      // Speech.speak({
      //   text: classification,
      //   voice: 'en-US'
      // }).then(started => {
      //   console.log('Speech started');
      // }).catch(error => {
      //   console.log('You\'ve already started a speech instance.');
      // });
    }
    return (
      <View style={styles.container}>
        <CoreMLImage modelFile="DollarBillModel" onClassification={(evt) => this.onClassification(evt)}>
          <View style={styles.container}>
            <Text style={styles.info}>{classification}</Text>
            {
              classifications.map((classification) => {
                return (
                  <Text key={classification.identifier} style={styles.info}>Identifier: {classification.identifier}, Confidence: {classification.confidence}</Text>
                );
              })
            }
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
