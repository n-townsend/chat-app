import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import {
  onSnapshot,
  collection,
  orderBy,
  query,
  addDoc
} from "firebase/firestore";

// import react AsyncStorage
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected, }) => {
  const { name, color, userID } = route.params;

  //create messages state
  const [messages, setMessages] = useState([]);

  //call onSend function addMessage
  const addMessage = async (newMessages) => {
    const newMessageRef = await addDoc(
      collection(db, 'messages'),
      newMessages[0]
    );

    //if new message fails to add
    if (!newMessageRef.id) {
      Alert.alert('Unable to add message. Try again later');
    }
  };

  let unsubMessages;

  //Add name to Navigation Screen
  useEffect(() => {
    if (isConnected === true) {
      // avoid registering multiple listeners when useEffect is re-executed by unregistering current 
      // onSnapshot listener.
      if (unsubMessages) unsubMessages();
      unsubMessages = null;
      unsubMessages = onSnapshot(
        query(collection(db, 'messages'), orderBy('createdAt', 'desc')),
        (documentsSnapshot) => {
          let newMessages = [];
          documentsSnapshot.forEach((doc) => {
            // shape the messages to match what gifted chat expects
            newMessages.push({
              id: doc.id,
              ...doc.data(),
              createdAt: new Date(doc.data().createdAt.toMillis()),
            });
          });
          cacheMessages(newMessages);
          setMessages(newMessages);
        }
      );
    } else loadCachedMessages();

    return () => {
      if (unsubMessages) unsubMessages();
    };
  }, [isConnected]);

  const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };

  const loadCachedMessages = async () => {
    const cachedMessages = (await AsyncStorage.getItem('messages')) || [];
    setMessages(JSON.parse(cachedMessages));
  };

  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);

  // Alter the Gifted Chat default Bubble, ...props inherits props and is then given new wrapper style.
  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  const renderInputToolbar = (props) => {
    if (isConnected) {
      return <InputToolbar {...props} />;
    } else {
      return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: color }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(message) => addMessage(message)}
        user={{
          _id: userID,
          name: name,
        }}
        renderInputToolbar={renderInputToolbar}
      />
      {/*Checks the type of platform and if it is Android the Keyboard view will be
        adjusted to ensure the entered text is shown.*/}
      {Platform.OS === 'android' ? (<KeyboardAvoidingView behavior="height" />) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default Chat;