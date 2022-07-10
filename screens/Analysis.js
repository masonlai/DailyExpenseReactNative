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
import { VictoryPie } from "victory-native";

export default function Analysis(props) {
  const [catalogAvg, setCatalogAvg] = useState(["", ""]);

  const [paymentAvg, setPaymentAvg] = useState(["", ""]);


  const isFocused = useIsFocused();
  const db = DB;


  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `select AVG(records.value) as y,
      catalogs.name as x
      from records LEFT join paymentMethods ON records.paymentMethod_id = paymentMethods.id
      left join catalogs on records.catalog_id = catalogs.id
	  GROUP by records.catalog_id;`,
        [],
        (_, { rows: { _array } }) => {
          setCatalogAvg(_array);
        }
      );
    });


    db.transaction((tx) => {
      tx.executeSql(
        `select AVG(records.value) as y,
      paymentMethods.name as x
      from records LEFT join paymentMethods ON records.paymentMethod_id = paymentMethods.id
      left join catalogs on records.catalog_id = catalogs.id
	  GROUP by records.paymentMethod_id;`,
        [],
        (_, { rows: { _array } }) => {
          setPaymentAvg(_array);
        }
      );
    });

  }, [props, isFocused]);

  return (
    <ScrollView>
      {getHeader("catalog", "Average")}
      {catalogAvg.map(({ x, y }) => getRow(x, y))}

      {getHeader("paymentMethod", "Average")}
      {paymentAvg.map(({ x, y }) => getRow(x, y))}

      <Heading
        mt={5}
        size="lg"
        fontWeight="600"
        color="coolGray.800"
        _dark={{
          color: "warmGray.50",
        }}
      >
        Catalog chart
      </Heading>
      <VictoryPie
        data={catalogAvg}
        radius={100}
      />

      <Heading
        mt={5}
        size="lg"
        fontWeight="600"
        color="coolGray.800"
        _dark={{
          color: "warmGray.50",
        }}
      >
        Payment method chart
      </Heading>
      <VictoryPie
        data={paymentAvg}
        radius={100}
      />

    </ScrollView>
  );
}

function getRow(value1, value2) {
  return (
    <HStack space={2} alignItems="center">
      <Box
        width="50%"
        bg="primary.50"
        p={4}

        shadow={2}
        _text={{
          fontSize: "md",
          fontWeight: "bold",
          color: "black",
        }}
      >
        {value1}
      </Box>
      <Box
        width="50%"
        bg="primary.50"
        p={4}
        shadow={2}
        _text={{
          fontSize: "md",
          fontWeight: "bold",
          color: "black",
        }}
      >
        {value2}
      </Box>
    </HStack>
  );
}

function getHeader(Header1, Header2) {
  return (
    <HStack space={2} alignItems="center">
      <Box
        width="50%"
        bg="tertiary.200"
        mt={4}
        p={4}
        shadow={2}
        _text={{
          fontSize: "md",
          fontWeight: "bold",
          color: "black",
        }}
      >
        {Header1}
      </Box>
      <Box
        width="50%"
        bg="tertiary.200"
        mt={4}
        p={4}
        shadow={2}
        _text={{
          fontSize: "md",
          fontWeight: "bold",
          color: "black",
        }}
      >
        {Header2}
      </Box>
    </HStack>
  );
}
