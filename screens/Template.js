import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  Box,
  Select,
  Heading,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Text,
  Input,
  Button,
  Center,
  CheckIcon,
  Collapse,
  Alert,
  FormControl,
} from "native-base";
import DB from "../Common/DB";

function submit(itemName, value, catalog, paymentMethod) {
  const db = DB;
  console.log(
    `insert into templates (name, value, catalog_id, paymentMethod_id) values ('${itemName}' , '${value}' , '${catalog}' , '${paymentMethod}')`
  );
  db.transaction((tx) => {
    tx.executeSql(
      "insert into templates (name, value, catalog_id, paymentMethod_id) values (?,?,?,?)",
      [itemName, value, catalog, paymentMethod]
    );
  }, err => {console.log(err);});
}

export default function Template(props) {
  {
    const [catalog, setCatalog] = useState("");
    const [catalogs, setCatalogs] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentMethods, setPaymentMethods] = useState(null);
    const [itemName, setItemName] = useState("");
    const [cost, setCost] = useState(0);
    const [show, setShow] = useState(false);
    const isFocused = useIsFocused();
    const db = DB;


    useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from catalogs;`,
          [],
          (_, { rows: { _array } }) => setCatalogs(_array)
        );
      });

      db.transaction((tx) => {
        tx.executeSql(
          `select * from paymentMethods;`,
          [],
          (_, { rows: { _array } }) => setPaymentMethods(_array)
        );
      });
    }, [props, isFocused]);

    if (
      catalogs === null ||
      catalogs.length === 0 ||
      paymentMethods === null ||
      paymentMethods.length === 0
    ) {
      console.log('catalog:' + JSON.stringify(catalogs));
        console.log('paymentMethod:' + JSON.stringify(paymentMethods));
      return null;
    }

    return (
      <Center w="100%">
        <Box safeArea p="2" py="8" w="90%" maxW="290">
          <Heading
            size="lg"
            fontWeight="600"
            color="coolGray.800"
            _dark={{
              color: "warmGray.50",
            }}
          >
            Create new template
          </Heading>
          <Heading
            mt="1"
            _dark={{
              color: "warmGray.200",
            }}
            color="coolGray.600"
            fontWeight="medium"
            size="xs"
          ></Heading>

          <VStack space={3} mt="5">
            <FormControl>
              <FormControl.Label>Item Name</FormControl.Label>
              <Input onChangeText={(itemName) => setItemName(itemName)} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Cost</FormControl.Label>
              <Input
                type="number"
                keyboardType="numeric"
                onChangeText={(itemName) => setCost(itemName)}
              />
            </FormControl>

            <FormControl>
              <FormControl.Label>Catalog</FormControl.Label>
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
              <FormControl.Label>Payment method</FormControl.Label>
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

            <Collapse isOpen={show}>
              <Alert w="100%" maxW="400" status="success">
                <VStack space={1} flexShrink={1} w="100%">
                  <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                    <HStack flexShrink={1} space={2} alignItems="center">
                      <Alert.Icon />
                      <Text fontSize="md" fontWeight="medium" _dark={{
                      color: "coolGray.800"
                    }}>
                        New record added
                      </Text>
                    </HStack>
                    <IconButton variant="unstyled" _focus={{
                    borderWidth: 0
                  }} icon={<CloseIcon size="3" color="coolGray.600" />} onPress={() => setShow(false)} />
                  </HStack>
                </VStack>
              </Alert>
            </Collapse>


            <Button
              mt="2"
              colorScheme="indigo"
              onPress={() => {
                submit(itemName, cost, catalog, paymentMethod);
                setShow(true)
              }}
            >
              Add
            </Button>
          </VStack>
        </Box>
      </Center>
    );
  }
}
