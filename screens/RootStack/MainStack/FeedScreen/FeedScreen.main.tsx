import React, { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { Appbar, Card, Title } from "react-native-paper";
import firebase from 'firebase/compat/app';
import "firebase/firestore";
import { SocialModel } from "../../../../models/social.js";
import { styles } from "./FeedScreen.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { MainStackParamList } from "../MainStackScreen.js";
const DATA = [{id: "158695849385495",
  date: "12/28/2020, 8:00:00 PM",
  description: "fun fun event",
  image: "https://picsum.photos/700",
  location: "Niky's Apartment",
  name: "Grape Juice & Cheese Night",},
  {id: "3847475758585",
  date: "12/28/2020, 8:00:00 PM",
  description: "fun fun event",
  image: "https://picsum.photos/700",
  location: "Niky's Apartment",
  name: "Grape Juice & Cheese Night",
  }
]

/* HOW TYPESCRIPT WORKS WITH PROPS:

  Remember the navigation-related props from Project 2? They were called `route` and `navigation`,
  and they were passed into our screen components by React Navigation automatically.  We accessed parameters 
  passed to screens through `route.params` , and navigated to screens using `navigation.navigate(...)` and 
  `navigation.goBack()`. In this project, we explicitly define the types of these props at the top of 
  each screen component.

  Now, whenever we type `navigation.`, our code editor will know exactly what we can do with that object, 
  and it'll suggest `.goBack()` as an option. It'll also tell us when we're trying to do something 
  that isn't supported by React Navigation! */

interface Props {
  navigation: StackNavigationProp<MainStackParamList, "FeedScreen">;
}

export default function FeedScreen({ navigation }: Props) {
  // TODO: Initialize a list of SocialModel objects in state.

  /* TYPESCRIPT HINT: 
    When we call useState(), we can define the type of the state
    variable using something like this:
        const [myList, setMyList] = useState<MyModelType[]>([]); */

  /*
    TODO: In a useEffect hook, start a Firebase observer to listen to the "socials" node in Firestore.
    Read More: https://firebase.google.com/docs/firestore/query-data/listen
  
    Reminders:
      1. Make sure you start a listener that's attached to this node!
      2. The onSnapshot method returns a method. Make sure to return the method
          in your useEffect, so that it's called and the listener is detached when
          this component is killed. 
          Read More: https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener
      3. You'll probably want to use the .orderBy method to order by a particular key.
      4. It's probably wise to make sure you can create new socials before trying to 
          load socials on this screen.
  */

  const renderItem = ({ item }: { item: SocialModel }) => {
    // TODO: Return a Card corresponding to the social object passed in
    // to this function. On tapping this card, navigate to DetailScreen
    // and pass this social.
    return (
      <Card onPress={()=>navigation.navigate("DetailScreen", {social: item})} style = {{marginTop: 20}}>
        <Card.Cover source={{ uri: item.image }} />
        <Card.Content>
          <Card.Title title={item.name} subtitle={`${item.location} ・ ${item.date} `}/>
        </Card.Content>
      </Card>
    )
  };

  const NavigationBar = () => {
    // TODO: Return an AppBar, with a title & a Plus Action Item that goes to the NewSocialScreen.
    return <Appbar.Header>
        <Appbar.Content title="Socials" />
        <Appbar.Action onPress={() => navigation.navigate("NewSocialScreen")} icon = "plus"/>
      </Appbar.Header>
  };
  //Taiga- As I failed to debug the firebase for the goggle firebase cloud, I just used the fake data here for the social to implement the front end. 
  //If I manage to debug that, I'd try to implement retriving data from firebase and use that instead of fake DATA here.
  return (
    <>
      {NavigationBar()}
      <View style={[styles.container, styles.margin]}>
        <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      </View>
    </>
  );
}
