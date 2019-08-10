/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import React, {Fragment} from 'react';
import {
  View,
  Text,
  StyleSheet,
  YellowBox
} from 'react-native';

YellowBox.ignoreWarnings([
  'Unrecognized WebSocket'
])

import Routes from './routes'




function App() {
  return (
    <Routes />
  );
};



export default App;
