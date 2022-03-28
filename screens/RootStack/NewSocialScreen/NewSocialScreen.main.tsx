import React, { useState, useEffect } from "react";
import { Platform, Text, View } from "react-native";
import { Appbar, TextInput, Snackbar, Button } from "react-native-paper";
import { getFileObjectAsync, uuid } from "../../../Utils";

// See https://github.com/mmazzarolo/react-native-modal-datetime-picker
// Most of the date picker code is directly sourced from the example.
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { getApp } from "firebase/app";
// See https://docs.expo.io/versions/latest/sdk/imagepicker/
// Most of the image picker code is directly sourced from the example.
import * as ImagePicker from "expo-image-picker";
import { styles } from "./NewSocialScreen.styles";
import firebase from "firebase/app"
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "firebase/firestore"
import {doc, getFirestore, setDoc} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage"
import { SocialModel } from "../../../models/social";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackScreen";

{/* import firebase from "firebase/app";
import "firebase/firestore";
import { doc, getFirestore,  setDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";*/}

interface Props {
  navigation: StackNavigationProp<RootStackParamList, "NewSocialScreen">;
}

export default function NewSocialScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const[location, setLocation] = useState("");
  const[description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [image, setImage] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  /* TODO: Declare state variables for all of the attributes 
           that you need to keep track of on this screen.
    
     HINTS:

      1. There are five core attributes that are related to the social object.
      2. There are two attributes from the Date Picker.
      3. There is one attribute from the Snackbar.
      4. There is one attribute for the loading indicator in the submit button.
  
  */

  // TODO: Follow the Expo Docs to implement the ImagePicker component.
  // https://docs.expo.io/versions/latest/sdk/imagepicker/
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      console.log(result.uri);
      setImage(result.uri);
    }
  };
  // TODO: Follow the GitHub Docs to implement the react-native-modal-datetime-picker component.
  // https://github.com/mmazzarolo/react-native-modal-datetime-picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const dateToString = (date: Date) => {
    let strDate:string = JSON.stringify(date);
    console.log(strDate)
    const month = strDate.substring(6,8);
    const dating = strDate.substring(9,11);
    const year = strDate.substring(1,5);
    const time = strDate.substring(12,17);
    
    strDate = `${month}/${dating}/${year}, ${time}`;
    return strDate
  }
  const handleConfirm = (date:Date) => {
    setDate(dateToString(date));
    hideDatePicker();
  };
  // TODO: Follow the SnackBar Docs to implement the Snackbar component.
  // https://callstack.github.io/react-native-paper/snackbar.html
  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  
  const saveEvent = async () => {
    // TODO: Validate all fields (hint: field values should be stored in state variables).
    // If there's a field that is missing data, then return and show an error
    // using the Snackbar.
    if (!name || !location || !description || !date || !image) {
      setVisible(true);
      return
    }
  //   const uploadImage = async(uri:string) => {
  // const response = await fetch(uri);
  // const blob = await response.blob();
  // return blob

  // Otherwise, proceed onwards with uploading the image, and then the object.
//     const asyncAwaitNetworkRequests = async () => {
//     const object = await getFileObjectAsync(image);
//     const result = await firebase
//     .storage()
//     .ref()
//     .child(uuid() + ".jpg")
//     .put(object as Blob);
//     const downloadURL = await result.ref.getDownloadURL();
//     const doc: SocialModel = {
//     eventName: name,
//     eventDate: date,
//     eventLocation: location,
//     eventDescription: description,
//     eventImage: downloadURL,
//     };
//   await firebase.firestore().collection("socials").doc().set(doc);
//   console.log("Finished social creation.");
// };
    try {
      
      // NOTE: THE BULK OF THIS FUNCTION IS ALREADY IMPLEMENTED FOR YOU IN HINTS.TSX.
      // READ THIS TO GET A HIGH-LEVEL OVERVIEW OF WHAT YOU NEED TO DO, THEN GO READ THAT FILE!

      // (0) Firebase Cloud Storage wants a Blob, so we first convert the file path
      // saved in our eventImage state variable to a Blob.

      // (1) Write the image to Firebase Cloud Storage. Make sure to do this
      // using an "await" keyword, since we're in an async function. Name it using
      // the uuid provided below.

      // (2) Get the download URL of the file we just wrote. We're going to put that
      // download URL into Firestore (where our data itself is stored). Make sure to
      // do this using an async keyword.

      // (3) Construct & write the social model to the "socials" collection in Firestore.
      // The eventImage should be the downloadURL that we got from (3).
      // Make sure to do this using an async keyword.
      
      // (4) If nothing threw an error, then go back to the previous screen.
      //     Otherwise, show an error.
      
        setLoading(true);
        console.log("1")
        const response = await fetch(image);
        const object = await response.blob();
        console.log("2")
        const db = getFirestore();
        console.log("3")
        const storage = getStorage();
        console.log("4")
        const storageRef = ref(storage,  uuid() + ".jpg");
        console.log("5");
        uploadBytesResumable(storageRef, object as Blob)
        .then((snapshot) => {
          console.log('6');
          getDownloadURL(storageRef).then(async (url) => {
            const docs: SocialModel = {
              name: name,
              date: date,
              location: location,
              description: description,
              image: url,
            };
            await setDoc(doc(db, "socials", uuid()), docs);
            setLoading(false);
            navigation.navigate("Main");
            console.log("Finished");
            
          })
        })
    
      } catch (e) {
      setLoading(false);
      console.log("Error while writing social:", e);
    }
  };

  const Bar = () => {
    return (
      <Appbar.Header>
        <Appbar.Action onPress={navigation.goBack} icon="close" />
        <Appbar.Content title="Socials" />
      </Appbar.Header>
    );
  };

  return (
    <>
      <Bar />
      <View style={{ ...styles.container, padding: 20 }}>
          <TextInput
        style ={{backgroundColor:null}}
        label="Event Name"
        value={name}
        onChangeText={name => setName(name)}
      />
          <TextInput
        style ={{backgroundColor:null}}
        label="Event Location"
        value={location}
        onChangeText={location => setLocation(location)}
      />
          <TextInput
        style ={{backgroundColor:null}}
        label="Event Description"
        value={description}
        onChangeText={description => setDescription(description)}
      />
        {date ? <Button mode = "outlined" style = {styles.margin_between} onPress={showDatePicker}>{date}</Button> 
        : <Button mode = "outlined" style = {styles.margin_between} onPress={showDatePicker}>
          CHOOSE A DATE
        </Button>}
        

        {image ? <Button mode = "outlined" style = {styles.margin_between} onPress={pickImage}>
          CHANGE IMAGE
        </Button> : 
        <Button mode = "outlined" style = {styles.margin_between} onPress={pickImage}>
          PICK AN IMAGE
        </Button>
        }
        
        <Button loading = {loading} mode = "outlined" style = {[styles.margin_between, styles.background]} color = "black" onPress={() => saveEvent()}>
          SAVE EVENT
        </Button>

        {isDatePickerVisible ? <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      /> : <></>
    }
        <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {
          },
        }}>
        Caution: you are mising one of the required fileds
      </Snackbar>
      
      </View>
    </>
  );
}
