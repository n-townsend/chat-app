// import the two screens
import Start from './components/Start';
import Chat from './components/Chat';

// import react components
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from "react";
import { Alert } from "react-native";

// Create the navigator
const Stack = createNativeStackNavigator();

// import Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const App = () => {
  const connectionStatus = useNetInfo();
  // web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBp52GP1b8cYZ_tgStpJdKYACbB0M-B5KQ",
    authDomain: "chat-with-me-ac021.firebaseapp.com",
    projectId: "chat-with-me-ac021",
    storageBucket: "chat-with-me-ac021.appspot.com",
    messagingSenderId: "725323225633",
    appId: "1:725323225633:web:28a9564c1cd96f3123a160"
  };

  // initialize Firebase
  const app = initializeApp(firebaseConfig);

  // initialize Cloud Firestore
  const db = getFirestore(app);
  const storage = getStorage(app);

  // check internet connection and alert if offline
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen name="Start" component={Start} />
        <Stack.Screen name="Chat">
          {(props) => (
            <Chat
              isConnected={connectionStatus.isConnected}
              db={db}
              storage={storage}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;