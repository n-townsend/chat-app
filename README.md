# chat_app

## Description

Chat App is a mobile application built using React Native that provides a seamless chatting experience. It offers real-time messaging, multimedia and location sharing features.

<img src="/media/images/start_screen.jpg" alt="Screenshot of the Chat App" width="200">


## Available Features

- Users can enter their name and select background color for chatting.
- Seperate page that displays conversations with a normal text input field and submit button.
- Can send both images and location data.
- Data can be stored both on and offline.

## Current Dependencies

- React Native
- Expo
- GiftedChat
- Firestore Database and Cloud Storage
- AsyncStorage
- Expo imagePicker and Location

## Set up Development Eviroment

### Expo

- Set up an Expo Account
- Install Expo CLI: 'npm install -g expo-cli'

### Android Studio

- If planning to run the app using an emulator, you will need to set up Android Studio.
  Official set up guide can be found here: [Expo Android Development Environment](https://docs.expo.dev/workflow/android-studio-emulator/)

## Database Configuration

- Go to Firebase Console and create new project.
- Go to the 'Rules' tab and set "allow read write: if true" and submit.
- Set up anonymous authentication in Firebase Authentication & Firebase Database
- Get your Firebase configuration object for this project.
- In App.js, replace firebaseConfig object with new Firebase Configuration.

## Libraries to Install

- Before running the app, make sure to install the required dependencies using npm or yarn:

- npm install
- @react-native-async-storage/async-storage
- @react-native-community/netinfo
- @react-navigation/native
- @react-navigation/native-stack
- expo firebase
- react-native
- react-native-gifted-chat
- react-native-safe-area-context
- react-native-screens
- expo-image-picker
- expo-location
- react-native-maps

## Run the App

expo start (starts the development server)
expo start --offline (for offline testing)
