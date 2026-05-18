import React from 'react';
import {LogBox} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

LogBox.ignoreLogs([
  'Non-serializable values were found',
  'Sending `onAnimatedValueUpdate`',
]);

const App = (): React.JSX.Element => <AppNavigator />;

export default App;
