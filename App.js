import React, {useState, useRef, useCallback, useEffect, useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import Login from './components/Login';

const App = () => {

  return (
    <View style={styles.main}>
      <Login/>
    </View>
  );
};
const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default App;
