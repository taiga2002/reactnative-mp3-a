import { StyleSheet, Text, View } from 'react-native';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

async function writeToDB() {
  try {
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

}
export default function App() {
  const firebaseConfig = require("./keys.json");
  
  if (getApps() == 0) {
    console.log("Initializing")
    const firebaseApp = initializeApp(firebaseConfig);
  }
  writeToDB();

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});