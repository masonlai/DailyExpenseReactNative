import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  ScrollView,
  Select,
  Box,
  VStack,
  NativeBaseProvider,
  FormControl,
  Heading,
  Checkbox,
  Divider,
  Flex,
  CheckIcon,
  Image,
  HStack,
  Center,
  Text,
} from "native-base";
import DB from "../Common/DB";
import { useIsFocused } from "@react-navigation/native";

export default function Records(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [records, setRecords] = useState([]);

  const [sortByDate, setSortByDate] = useState(false);
  const [sortByCost, setSortByCost] = useState(false);

  const [catalog, setCatalog] = useState("");
  const [catalogs, setCatalogs] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const isFocused = useIsFocused();
  const db = DB;


  const Sqlquery = () =>{

    const getOrderQuery = () =>{
      if (sortByDate || sortByCost) {
        if (sortByDate) {
          return "order by timestamp desc";
        }
        if (sortByCost) {
            return "order by value desc";
        }
        if (sortByDate && sortByCost) {
            return "order by value, records.Timestamp desc";
        }
      }
      return "";
    }

    const getWhereQuery = () =>{
      if (catalog !== ''|| paymentMethod!=='') {
        if (catalog !== '') {
          return  `where records.catalog_id = ${catalog}`;
        }
        if (paymentMethod !== '') {
          return `where records.paymentMethod_id = ${paymentMethod}`;
        }
        if (catalog !== ''&& paymentMethod!=='') {
          return `where records.paymentMethod_id = ${paymentMethod} and records.catalog_id = ${catalog}`;
        }
      }
      return "";
    }

    setModalVisible(false);
    db.transaction((tx) => {
      tx.executeSql(`select records.id as id,
      records.name as name,
      records.value as value,
      records.image_uri as image_uri,
      STRFTIME('%d/%m/%Y', records.Timestamp) as timestamp,
      STRFTIME('%H:%M', records.Timestamp) as time,
      paymentMethods.name as paymentMethod,
      catalogs.name as catalog
      from records LEFT join paymentMethods ON records.paymentMethod_id = paymentMethods.id
      left join catalogs on records.catalog_id = catalogs.id
      ${getWhereQuery()}
      ${getOrderQuery()};`, [], (_, { rows: { _array } }) => setRecords(_array));
    });
  }


  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`select records.id as id,
      records.name as name,
      records.value as value,
      records.image_uri as image_uri,
      STRFTIME('%d/%m/%Y', records.Timestamp) as timestamp,
      STRFTIME('%H:%M', records.Timestamp) as time,
      paymentMethods.name as paymentMethod,
      catalogs.name as catalog
      from records LEFT join paymentMethods ON records.paymentMethod_id = paymentMethods.id
      left join catalogs on records.catalog_id = catalogs.id;`, [], (_, { rows: { _array } }) => setRecords(_array));
    });

    db.transaction((tx) => {
      tx.executeSql(`select * from catalogs;`, [], (_, { rows: { _array } }) =>
        setCatalogs(_array)
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        `select * from paymentMethods;`,
        [],
        (_, { rows: { _array } }) => setPaymentMethods(_array)
      );
    });
    setRecords(records);
  }, [props, isFocused]);

  if (
    catalogs === null ||
    catalogs.length === 0 ||
    paymentMethods === null ||
    paymentMethods.length === 0
  ) {
    console.log("catalog:" + JSON.stringify(catalogs));
    console.log("paymentMethod:" + JSON.stringify(paymentMethods));
    return null;
  }

  return (
    <NativeBaseProvider>
      <Modal isOpen={modalVisible} onClose={setModalVisible} size="lg">
        <Modal.Content {...styles["left"]}>
          <Modal.CloseButton />
          <Modal.Header>Filter</Modal.Header>
          <Modal.Body>
            <ScrollView>
              <Checkbox onChange={()=>setSortByDate(!sortByDate)}>
                Sorted By Date
              </Checkbox>
              <Checkbox onChange={()=>setSortByCost(!sortByCost)}>
                Sorted By Cost
              </Checkbox>
              <FormControl>
                <Select
                  selectedValue={catalog}
                  minWidth="200"
                  accessibilityLabel="Choose Catalog"
                  placeholder="Choose Catalog"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => setCatalog(itemValue)}
                >
                  {catalogs.map(({ id, name }) => (
                    <Select.Item key={id} label={name} value={id} />
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <Select
                  selectedValue={paymentMethod}
                  minWidth="200"
                  accessibilityLabel="Choose paymentMethod"
                  placeholder="Choose paymentMethod"
                  _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size="5" />,
                  }}
                  mt={1}
                  onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                >
                  {paymentMethods.map(({ id, name }) => (
                    <Select.Item key={id} label={name} value={id} />
                  ))}
                </Select>
              </FormControl>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button
                variant="ghost"
                colorScheme="blueGray"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
                  Sqlquery();
                }}
              >
                Save
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Button
        mt="2"
        colorScheme="lightBlue"
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        Filter
      </Button>

      <ScrollView
        contentContainerStyle={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <VStack w="100%">
          {records.map(
            ({
              id,
              name,
              value,
              image_uri,
              paymentMethod,
              catalog,
              timestamp,
              time
            }) => (
              <Box
                key={id}
                shadow={1}
                bg={"white"}
                my={2}
                mx={3}
                borderRadius={16}
              >
                <VStack key={1}>
                  <HStack space={2} justifyContent="center">
                    <Heading size="md" p={4} color={"trueGray.700"}>
                      <Text>{name}</Text>
                    </Heading>

                    <Text ml="auto" mr={3} mt={2}>
                      {timestamp}
                      {"\n"}
                      {time}
                    </Text>

                  </HStack>

                  <Divider bg={"warmGray.200"} />

                  <Flex nativeID="1111" p={4} justify="center" d="flex">
                    <HStack space={4} justifyContent="center">
                      <Center>
                        <Text underline>Cost</Text>
                        {value}
                      </Center>
                      <Center>
                        <Text underline>Payment</Text>
                        {paymentMethod}
                      </Center>
                      <Center>
                        <Text underline>Catalog</Text>
                        {catalog}
                      </Center>
                      <Image
                        source={{
                          uri: image_uri,
                        }}
                        alt="Alternate Text"
                        size="md"
                      />
                    </HStack>
                  </Flex>
                </VStack>
              </Box>
            )
          )}
        </VStack>
      </ScrollView>
    </NativeBaseProvider>
  );
}

const styles = {
  top: {
    marginBottom: "auto",
    marginTop: 0,
  },
  bottom: {
    marginBottom: 0,
    marginTop: "auto",
  },
  left: {
    marginLeft: 0,
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
  },
  center: {},
};
