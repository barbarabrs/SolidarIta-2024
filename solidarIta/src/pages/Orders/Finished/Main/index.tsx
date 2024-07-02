import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
  useToast,
  useColorModeValue
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TitlePage from "../../../../components/TitlePage";
import { GroceryList } from "../../../../contexts/GroceryListContext";
import { ProductsList } from "../../../../contexts/ProductListContext";
import api from "../../../../services/api";
import { parseCookies } from "nookies";

export interface Logs {
  created: string;
  description: string;
}

export function MainFinishedOrders() {
  const { groceryListId } = useParams();
  const [groceryList, setGroceryList] = useState<GroceryList[]>([]);
  const [productList, setProductList] = useState<ProductsList[]>([]);
  const [logs, setLogs] = useState<Logs[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notAllowed, setNotAllowed] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();
  const cookies = parseCookies();

  useEffect(() => {
    const id = cookies["id"];
    let res: GroceryList[] = [];
    setIsLoading(false);
    api
      .post("/groceryList/getOne", { id: groceryListId, partner: id })
      .then((response) => {
        if (response.data.length === 0) {
          navigate("/*");
        }
        res = response.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (res[0] && res[0].status === "Finalizado") {
          setGroceryList(res);
          api
            .post("/products/getProductsList", { id: groceryListId })
            .then((response) => {
              console.log(response);
              setProductList(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          setNotAllowed(true);
        }
      });
    setIsLoading(true);
  }, []);

  const getTotalPrice = () => {
    return productList.reduce((acc, product) => {
      return acc + parseFloat(product.price) * product.amount;
    }, 0);
  };

  return (
    <>
      <TitlePage title={"Pedido"} />
      {isLoading && groceryList.length > 0 && productList.length > 0 ? (
        <Box>
          <Grid
            my={5}
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(20, 1fr)"
            gap={2}
          >
            <GridItem rowSpan={4} colSpan={4}>
              <Image
                border={"1px solid lightgrey"}
                borderRadius={"3%"}
                height="150px"
                width="100%"
                objectFit="cover"
                src={
                  groceryList[0].image !== ""
                    ? groceryList[0].image
                    : 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'
                }
                alt="Selected"
                mb={"5px"}
              />
            </GridItem>
            <GridItem rowSpan={4} colSpan={1}></GridItem>
            <GridItem rowSpan={1} colSpan={15}>
              <Box>
                <Text
                  borderColor="200"
                  border="1px solid"
                  borderRadius={"6px"}
                  p={"6px"}
                  w="fit-content"
                >
                  {groceryList[0].username}
                </Text>
              </Box>
              <Box>
                <Text fontSize="20px" fontWeight={"bold"}>
                  {groceryList[0].name}
                </Text>
              </Box>
            </GridItem>
            <GridItem colSpan={15}>
              <Text>{groceryList[0].description}</Text>
            </GridItem>
            <GridItem colSpan={15}>
              <Text>{groceryList[0].goal}</Text>
            </GridItem>
          </Grid>

          <Box w="100%">
            <Text textAlign={"center"} mb="10px">
              Todos os itens da lista estão pagos! E pedido foi entregue
            </Text>
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {productList.map((product) => (
                <GridItem key={product.id}>
                  <Flex
                    height={"100%"}
                    maxH={"200px"}
                    borderColor={"green"}
                    borderWidth={"3px"}
                    borderRadius="lg"
                    overflow="hidden"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Flex width="120px" justifyContent={"center"}>
                      <Image
                        src={product.image ?? 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'}
                        alt={product.name}
                        maxHeight={"180px"}
                        objectFit={"cover"}
                      />
                    </Flex>
                    <Box ml="5" flex="1">
                      <Text mt={2} fontSize="xl" fontWeight="semibold">
                        {product.name}
                      </Text>
                      <Text fontSize="md" color="gray.500">
                        {product.description}
                      </Text>
                      <Text mt={2} fontSize="lg" fontWeight="semibold">
                        ${product.price}
                      </Text>
                    </Box>
                    <Box mr="2" display={"inline-flex"} alignItems={"center"}>
                      <Text mr="1">Qtd.</Text>
                      <Text
                        bg={useColorModeValue( "white", "205d8b")}
                        border="1px black solid"
                        p="2px 9px"
                        borderRadius={"5px"}
                      >
                        {product.amount}
                      </Text>
                    </Box>
                  </Flex>
                </GridItem>
              ))}
            </Grid>
          </Box>
          <Grid mt="30px">
            <Box>
              <Heading mb={3} fontSize="22px">
                Prestação de conta
              </Heading>
            </Box>
            <Divider borderColor="100" mb="1rem" />
            {groceryList[0].accountability === 1 ? (
              <Text
                color="black"
                dangerouslySetInnerHTML={{
                  __html: groceryList[0].accountability_message,
                }}
              />
            ) : (
              <Text color="red" textAlign={"center"}>
                Instituição não prestou contas ainda
              </Text>
            )}
          </Grid>
          <Box
            position="fixed"
            bottom="20px"
            right="20px"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Box
              bg={useColorModeValue( "white", "205d8b")}
              mr="4"
              border="1px black solid"
              p="2px 9px"
              borderRadius={"5px"}
            >
              Total recebido: R${getTotalPrice().toFixed(2)}
            </Box>
            <Box
              bg={useColorModeValue( "white", "205d8b")}
              mr="4"
              border="1px black solid"
              p="2px 9px"
              borderRadius={"5px"}
            >
              Entregue em{" "}
              {moment(groceryList[0].scheduling).format("DD/MM/yyyy HH:mm:ss")}
            </Box>
          </Box>
        </Box>
      ) : isLoading && notAllowed ? (
        <Text textAlign={"center"}>Lista de compra não encontrada</Text>
      ) : (
        <SimpleGrid columns={1} spacing={10}>
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
          <Skeleton height="60px" />
        </SimpleGrid>
      )}
    </>
  );
}
