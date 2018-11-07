import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

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

    if (classifications && classifications.length > 0) {
      // Loop through all of the classifications and find the best match
      // this.setState({ classifications });
      classifications.forEach((classification) => {
        if (!bestMatch || classification.confidence > bestMatch.confidence) {
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
      if (this.state.bestMatch && this.state.bestMatch.identifier && this.state.bestMatch.identifier === "ten-dollar-bill") {
        classification = "TEN DOLLAR BILL";
      }
      else if (this.state.bestMatch && this.state.bestMatch.identifier && this.state.bestMatch.identifier === "twenty-dollar-bill") {
        classification = "20 DOLLAR BILL";
      }
      else if (this.state.bestMatch && this.state.bestMatch.identifier && this.state.bestMatch.identifier === "five-dollar-bill") {
        classification = "FIVE DOLLAR BILL";
      }
      else if (this.state.bestMatch && this.state.bestMatch.identifier && this.state.bestMatch.identifier === "one-dollar-bill") {
        classification = "ONE DOLLAR BILL";
      }
      else {
        classification = "NOT DOLLAR BILL";
      }

    }

    return (
      <View style={styles.container}>
        <CoreMLImage modelFile="DollarBillModel" onClassification={(evt) => this.onClassification(evt)}>
          <View style={styles.container}>
            <Text style={styles.info}>{classification}</Text>
            {/*{*/}
              {/*classifications.map((classification) => {*/}
                {/*return (*/}
                  {/*<Text style={styles.info}>Identifier: {classification.identifier}, Confidence: {classification.confidence}</Text>*/}
                {/*)*/}
              {/*})*/}
            {/*}*/}
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
