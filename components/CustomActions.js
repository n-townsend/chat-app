// Import Expo Components
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// Import React Components
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';

// Import Firebase Components
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const CustomActions = ({
  wrapperStyle,
  iconTextStyle,
  onSend,
  userID,
  storage,
}) => {
  const actionSheet = useActionSheet();

  const onActionPress = () => {
    const options = [
      'Choose Picture From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },

      // Selects the action function based on the index selected from the `options`
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePicture();
            return;
          case 2:
            getLocation();
          default:
        }
      }
    );
  };

  // Uploads the image to firebase storage, then uses the img URL and adds to messages
  const sendAndUploadImage = async (imageURI) => {
    const uniqueRefString = generateReference(imageURI);
    const response = await fetch(imageURI);
    const blob = await response.blob();
    const newUploadRef = ref(storage, uniqueRefString);
    uploadBytes(newUploadRef, blob).then(async (snapshot) => {
      console.log('File has been uploaded');
      const imageURL = await getDownloadURL(snapshot.ref);
      onSend({ image: imageURL });
    });
  };

  // Gets the users media permissions and if granted, will open the library and pass the
  // img URI to `sendAndUploadImage`
  const pickImage = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission?.granted) {
      let result = await ImagePicker.launchImageLibraryAsync();

      if (!permission.cancelled) await sendAndUploadImage(result.assets[0].uri);
    } else Alert.alert("Permissions haven't been granted.");
  };

  // Gets the users camera permissions and if granted, will open the camera and pass the
  // img URI to `sendAndUploadImage`
  const takePicture = async () => {
    let permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission?.granted) {
      let result = await ImagePicker.launchCameraAsync();

      if (!permission.cancelled) await sendAndUploadImage(result.assets[0].uri);
    } else Alert.alert("Permissions haven't been granted.");
  };

  // Gets the users location permissions and if granted, will get the users current location and send it
  const getLocation = async () => {
    let permission = await Location.requestForegroundPermissionsAsync();

    if (permission?.granted) {
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend({
          location: {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          },
        });
      } else Alert.alert('Error occurred while fetching location.');
    } else Alert.alert("Permissions haven't been granted.");
  };

  // Generates a unique string based on the time, img name and userID
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split('/')[uri.split('/').length - 1];
    return `${userID}-${timeStamp}-${imageName}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onActionPress}
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Let's you choose to send an image or your geolocation."
      accessibilityRole="button"
    >
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}></Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 10,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});

export default CustomActions;