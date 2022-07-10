import { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Text,
  Input,
  Button,
  Center,
  Collapse,
  Alert,
  FormControl,
} from "native-base";
import DB from "../Common/DB";

function submit(catalog) {
  const db = DB;
  console.log(`submit new Catalog: ${catalog}`);
  db.transaction((tx) => {
    tx.executeSql(
      "insert into catalogs (name) values (?)",
      [catalog]
    );
  });
}
export default function NewCatalog() {
  {
    const [catalog, setCatalog] = useState("");
    const [show, setShow] = useState(false);

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
            New Catalog
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
              <FormControl.Label>Catalog</FormControl.Label>
              <Input onChangeText={(catalog) => setCatalog(catalog)} />
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
              onPress={() => {submit(catalog); setShow(true)}}
            >
              Add
            </Button>
          </VStack>
        </Box>
      </Center>
    );
  }
}
