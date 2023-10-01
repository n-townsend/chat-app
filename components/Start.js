import { useState } from 'react';
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Alert,
  Platform,
} from 'react-native';

const image = require('../media/images/background-image.png');


const backgroundColors = {
  Fuchsia: '#FF77FF',
  Nardo: '#686A6C',
  Azure: '#4863A0',
  Seafoam: '#3EA99F',
};

const Start = ({ navigation }) => {
  const auth = getAuth();
  const [name, setName] = useState('');
  const [color, setColor] = useState(backgroundColors);

  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        // Navigate to the Chat screen with user ID, name, and color
        navigation.navigate("Chat", { userID: result.user.uid, name: name, color: color });
      })
      .catch((error) => {
        Alert.alert("Unable to sign in, try later again.");
      })
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.appTitle}>Chat With Me</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={name}
            onChangeText={setName}
            placeholder='Type your username here'
            placeholderTextColor="#757083"
          />
          <Text style={styles.textColorSelector}>Choose your background color:</Text>
          <View style={styles.colorSelector}>
            <TouchableOpacity
              style={[
                styles.circle,
                color === backgroundColors.Fuchsia && styles.selectedCircle,
                { backgroundColor: backgroundColors.Fuchsia },
              ]}
              onPress={() => setColor(backgroundColors.Fuchsia)}>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.circle,
                color === backgroundColors.Nardo && styles.selectedCircle,
                { backgroundColor: backgroundColors.Nardo },
              ]}
              onPress={() => setColor(backgroundColors.Nardo)}>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.circle,
                color === backgroundColors.Azure && styles.selectedCircle,
                { backgroundColor: backgroundColors.Azure },
              ]}
              onPress={() => setColor(backgroundColors.Azure)}>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.circle,
                color === backgroundColors.Seafoam && styles.selectedCircle,
                { backgroundColor: backgroundColors.Seafoam },
              ]}
              onPress={() => setColor(backgroundColors.Seafoam)}>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={signInUser}>
              <Text>Start chatting</Text>
            </TouchableOpacity>
          </View>
        </View>
        {Platform.OS === 'ios' ? (
          <KeyboardAvoidingView behavior="padding" />
        ) : null}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
    padding: '6%',
  },
  appTitle: {
    flex: 2,
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    alignSelf: 'center',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#000000',
    padding: '6%',
    flexBasis: 160,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    padding: 15,
    borderWidth: 1,
    borderColor: '#757083',
    marginTop: 15,
    marginBottom: 15,
  },
  textColorSelector: {
    fontSize: 16,
    fontWeight: '300',
    color: '#8A95A5',
  },
  colorSelector: {
    flex: 1,
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 5,
  },
  selectedCircle: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  button: {
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    borderRadius: 50,
  },
});
export default Start;