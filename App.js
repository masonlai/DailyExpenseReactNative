import * as React from "react";
import {useEffect} from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import {
  NativeBaseProvider,
  Box,
  Pressable,
  VStack,
  Text,
  HStack,
  Divider,
} from "native-base";
const Drawer = createDrawerNavigator();
import Analysis from './screens/Analysis';
import Records from './screens/Records';
import NewRecord from './screens/NewRecord';
import NewCatalog from './screens/NewCatalog';
import Template from './screens/Template';
import DB from "./Common/DB";




function SideMenu() {
  return (
    <Box safeArea flex={1}>
      <Drawer.Navigator
        drawerContent={(props) => <SideMenuContent  {...props} />}
      >
      <Drawer.Screen name="Records" component={Records} />
      <Drawer.Screen name="Analysis" component={Analysis} />

              <Drawer.Screen name="New Record" component={NewRecord} />
              <Drawer.Screen name="Template" component={Template} />

        <Drawer.Screen name="New Catalog" component={NewCatalog} />

      </Drawer.Navigator>
    </Box>
  );
}
export default function App() {
  const db = DB;
  LogBox.ignoreLogs(["Invalid prop `textStyle` of type `array` supplied to `Cell`","Warning: Each child in a list should have a unique"])
  useEffect(() => {
    db.transaction(tx => { tx.executeSql("create table if not exists catalogs (id integer primary key not null, name text, UNIQUE(name));");}, err => {console.log(err);})

    db.transaction(tx => { tx.executeSql("create table if not exists paymentMethods (id integer primary key not null, name text, UNIQUE(name));");}, err => {console.log(err);})

    db.transaction(tx => { tx.executeSql(`create table if not exists records (id integer primary key not null, name text, value real, paymentMethod_id interger not null, image_uri text,
       catalog_id interger not null, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (catalog_id) references catalogs (id), FOREIGN KEY (paymentMethod_id) references paymentMethods (id));`);}, err => {console.log(err);})

       db.transaction(tx => { tx.executeSql(`create table if not exists templates (id integer primary key not null, name text, value real, paymentMethod_id interger not null,
       catalog_id interger not null, Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (catalog_id) references catalogs (id), FOREIGN KEY (paymentMethod_id) references paymentMethods (id));`);}, err => {console.log(err);})

    db.transaction(tx => { tx.executeSql("insert OR IGNORE into catalogs (name) values ('Transport');");})

    db.transaction(tx => { tx.executeSql("insert OR IGNORE into catalogs (name) values ('Food');");})

    db.transaction(tx => { tx.executeSql("insert OR IGNORE into catalogs (name) values ('Entertainment');");})

    db.transaction(tx => { tx.executeSql("insert OR IGNORE into catalogs (name) values ('Living');");})

    db.transaction(tx => { tx.executeSql("insert OR IGNORE into paymentMethods (name) values ('Cash');");})

    db.transaction(tx => { tx.executeSql("insert OR IGNORE into paymentMethods (name) values ('Credit Card');");})

    db.transaction(tx => { tx.executeSql("insert OR IGNORE into paymentMethods (name) values ('E-transfer');");})


  }, []);
  return (
    <NavigationContainer>
      <NativeBaseProvider>
        <SideMenu />
      </NativeBaseProvider>
    </NavigationContainer>
  );
}

function SideMenuContent(props) {
  return (
    <DrawerContentScrollView {...props} safeArea>
      <VStack space="6" my="2" mx="1">
        <VStack divider={<Divider />} space="4">
          <VStack space="3">
            {props.state.routeNames.map((name, index) => (
              <Pressable
                px="5"
                py="3"
                rounded="md"
                key={index}
                bg={
                  index === props.state.index
                    ? "rgba(6, 182, 212, 0.1)"
                    : "transparent"
                }
                onPress={() => {
                  props.navigation.navigate(name);
                }}
              >
                <HStack space="7" alignItems="center">
                  <Text
                    fontWeight="500"
                    color={
                      index === props.state.index ? "primary.500" : "gray.700"
                    }
                  >
                    {name}
                  </Text>
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </VStack>
      </VStack>
    </DrawerContentScrollView>
  );
}
