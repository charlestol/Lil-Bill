import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  NativeModules
} from 'react-native';
let Speech = require('react-native-speech');
let CustomVibration = NativeModules.CustomVibration;

const BEST_MATCH_THRESHOLD = 0.98;

const MODE = "vibrate";

import CoreMLImage from "react-native-core-ml-image";

const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    }
    else {
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
    };
  }

  doSpeakBillAmount = throttle((bestMatch) => {
    switch(bestMatch.identifier) {
      case "1":
        Speech.speak({
          text: "One Dollar",
          voice: 'en-US'
        }).then(started => {
        }).catch(error => {
        });
        break;
      case "5":
        Speech.speak({
          text: "Five Dollars",
          voice: 'en-US'
        }).then(started => {
        }).catch(error => {
        });
        break;
      case "10":
        Speech.speak({
          text: "Ten Dollars",
          voice: 'en-US'
        }).then(started => {
        }).catch(error => {
        });
        break;
      case "20":
        Speech.speak({
          text: "Twenty Dollars",
          voice: 'en-US'
        }).then(started => {
        }).catch(error => {
        });
        break;
      default:
        return;
    }
  }, 3500);

  doVibrationPattern = throttle((bestMatch) => {
    CustomVibration.vibrate(bestMatch.identifier);
  }, 3000);

  onClassification = throttle((classifications) => {
    let bestMatch = null;

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
        // Is this best match different than the current one?
        this.setState({ bestMatch: bestMatch });
        if (MODE === "vibrate") {
          this.doVibrationPattern(bestMatch);
        }
        else {
          this.doSpeakBillAmount(bestMatch);
        }
      } else {
        this.setState({ bestMatch: null });
      }
    } else {
      this.setState({ bestMatch: null });
    }
  }, 50);

  render() {
    let classification = null;
    let { bestMatch } = this.state;

    if (bestMatch && bestMatch.identifier) {
      switch(bestMatch.identifier) {
        case "1":
          classification = "One";
          break;
        case "5":
          classification = "Five";
          break;
        case "10":
          classification = "Ten";
          break;
        case "20":
          classification = "Twenty";
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
        <CoreMLImage modelFile="DollarBillModel" onClassification={(evt) => { this.onClassification(evt); }}>
          <View style={styles.container}>
            <Text style={styles.info}>{classification}</Text>
            {
              // classifications.map((classification) => {
              //   return (
              //     <Text key={classification.identifier} style={styles.info}>Identifier: {classification.identifier}, Confidence: {classification.confidence}</Text>
              //   );
              // })
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
