import {useEffect} from 'react';
import {Platform, View} from 'react-native';
import {checkFilePermissions} from './src/utils/libraryHelpers';
import Navigation from './src/navigation/Navigation';

const App = () => {
  useEffect(() => {
    checkFilePermissions(Platform.OS)
  }, []);

  return <Navigation/>;
};

export default App;
