import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
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

function submit(itemName, value, catalog, paymentMethod, image) {
  const db = DB;
  console.log(
    `insert into records (name, value, catalog_id, paymentMethod_id, image_uri) values ('${itemName}' , '${value}' , '${catalog}' , '${paymentMethod}' , '${image}')`
  );
  db.transaction((tx) => {
    tx.executeSql(
      "insert into records (name, value, catalog_id, paymentMethod_id, image_uri) values (?,?,?,?,?)",
      [itemName, value, catalog, paymentMethod, image]
    );
  });
}



export default function NewRecord(props) {
  {

    function applyTempalte(id){
       for(let i = 0;i< templates.length;i++){
         if(id==templates[i].id){
           console.log(templates[i]);
           setItemName(templates[i].name);
           setCost(templates[i].value);
           setPaymentMethod(templates[i].paymentMethod_id);
           setCatalog(templates[i].catalog_id)
         }
       }
    }
    const [catalog, setCatalog] = useState("");
    const [catalogs, setCatalogs] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [paymentMethods, setPaymentMethods] = useState(null);
    const [itemName, setItemName] = useState("");
    const [cost, setCost] = useState(0);
    const [show, setShow] = useState(false);
    const isFocused = useIsFocused();
    const [templates, setTemplates] = useState([]);
    const db = DB;

    const [image, setImage] = useState(null);

    const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log(result);

      if (!result.cancelled) {
        setImage(result.uri);
      }
    };

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
          `select * from templates;`,
          [],
          (_, { rows: { _array } }) => setTemplates(_array)
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
      console.log("catalog:" + JSON.stringify(catalogs));
      console.log("paymentMethod:" + JSON.stringify(paymentMethods));
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
            New expense record
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
              <Input value={itemName} onChangeText={(itemName) => setItemName(itemName)} />
            </FormControl>
            <FormControl>
              <FormControl.Label>Cost</FormControl.Label>
              <Input
                type="number"
                keyboardType="numeric"
                value={cost.toString()}
                onChangeText={(cost) => setCost(cost)}
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
                selectedValue={catalog}
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
                  <HStack
                    flexShrink={1}
                    space={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <HStack flexShrink={1} space={2} alignItems="center">
                      <Alert.Icon />
                      <Text
                        fontSize="md"
                        fontWeight="medium"
                        _dark={{
                          color: "coolGray.800",
                        }}
                      >
                        New record added
                      </Text>
                    </HStack>
                    <IconButton
                      variant="unstyled"
                      _focus={{
                        borderWidth: 0,
                      }}
                      icon={<CloseIcon size="3" color="coolGray.600" />}
                      onPress={() => setShow(false)}
                    />
                  </HStack>
                </VStack>
              </Alert>
            </Collapse>

            <Button mt="2" colorScheme="indigo" onPress={pickImage}>
              Select Img
            </Button>

            <Button
              mt="2"
              colorScheme="indigo"
              onPress={() => {
                submit(itemName, cost, catalog, paymentMethod, image);
                setShow(true);
              }}
            >
              Add
            </Button>

            <FormControl>
              <Select
                selectedValue={catalog}
                minWidth="200"
                accessibilityLabel="Choose templates"
                placeholder="Choose templates"
                _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size="5" />,
                }}
                mt={1}
                onValueChange={(itemValue) => applyTempalte(itemValue)}
              >
                {templates.map(({ id, name }) => (
                  <Select.Item key={id} label={name} value={id} />
                ))}
              </Select>
            </FormControl>
          </VStack>
        </Box>
      </Center>
    );
  }
}
