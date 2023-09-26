import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import { onSnapshot, collection, orderBy, query, addDoc } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
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
    navigation.setOptions({ title: name });
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (docs) => {
      let newMessages = [];
      docs.forEach(doc => {
        newMessages.push({
          id: doc.id,
          ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis())
        })
      })
      setMessages(newMessages);
    })
    return () => {
      if (unsubMessages) unsubMessages();
    }
  }, []);

  // Append new message to firestore
  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0]);
  };

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