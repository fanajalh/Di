import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar barStyle="light-content" backgroundColor="#000" />
    </>
  );
}
