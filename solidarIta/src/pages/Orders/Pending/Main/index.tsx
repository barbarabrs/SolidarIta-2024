import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Select,
  SimpleGrid,
  Skeleton,
  Tag,
  Text,
  useColorModeValue
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import React, { ReactNode, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GroceryList } from "../../../../contexts/GroceryListContext";
import api from "../../../../services/api";
import { Product, ProductsList } from "../../../../contexts/ProductListContext";
import TitlePage from "../../../../components/TitlePage";
import { UserInterfaceData } from "../../../../contexts/ProfileContext";
import { parseCookies } from "nookies";

export function MainPendingOrders() {
  const { groceryListId } = useParams();
  const [groceryList, setGroceryList] = useState<GroceryList[]>([]);
  const [productList, setProductList] = useState<ProductsList[]>([]);
  const [userData, setUserData] = useState<UserInterfaceData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notAllowed, setNotAllowed] = useState<boolean>(false);
  const toast = useToast();
  const cookies = parseCookies();
  const navigate = useNavigate();

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
        console.log(res);
        if (res[0] && res[0].status === "Pendente") {
          setGroceryList(res);
          api
            .post("/products/getProductsList", { id: groceryListId })
            .then((response) => {
              setProductList(response.data);
            })
            .catch((error) => {
              console.log(error);
            });
          api
            .post("/User", { id })
            .then((response) => {
              setUserData([response.data]);
              setIsLoading(true);
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

  const handlerAcceptOrder = () => {
    console.log(userData[0].address);
    if (userData[0]?.address) {
      api
        .post("groceryList/changeStatus", {
          id: groceryListId,
          status: "inProgress",
        })
        .then((response: { data: any }) => {
          toast({
            title: "Pedido aceito com sucesso",
            description: "Pedido agora está no ar",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          navigate("/orders");
        })
        .catch((error) => {
          console.log(error);
          toast({
            title: "Erro ao aceitar pedido",
            description: "Revise as informações e tente novamente",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: "Erro ao aceitar pedido",
        description:
          "É necessário ter o endereço cadastrado antes de aceitar um pedido. Vá em perfil > editar endereço",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
    }
  };

  const handlerDeclineOrder = () => {
    api
      .post("groceryList/changeStatus", {
        id: groceryListId,
        status: "canceled",
      })
      .then((response: { data: any }) => {
        toast({
          title: "Pedido recusado",
          description: "Pedido recusado com sucesso",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/orders");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao aceitar pedido",
          description: "Revise as informações e tente novamente",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <TitlePage title={"Pedido"} />
      {isLoading && groceryList.length > 0 && productList ? (
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
          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            {productList.map((product) => (
              <GridItem key={product.id}>
                <Flex
                  borderColor={"green"}
                  borderWidth={"3px"}
                  borderRadius="lg"
                  overflow="hidden"
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  height={"100%"}
                  maxH={"200px"}
                >
                  <Flex width="120px" justifyContent={"center"}>
                    <Image
                      src={product.image ?? 'https://solidarita.s3.amazonaws.com/78760e07-33ff-4f7f-9cc0-ef71846e5be9.jpeg'}
                      alt={product.name}
                      maxH="180px"
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
                      R${product.price}
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
              Total do pedido: R${getTotalPrice().toFixed(2)}
            </Box>
            <Button
              colorScheme={"facebook"}
              mr="4"
              onClick={handlerAcceptOrder}
            >
              Aceitar pedido
            </Button>
            <Button onClick={handlerDeclineOrder}>Rejeitar pedido</Button>
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
