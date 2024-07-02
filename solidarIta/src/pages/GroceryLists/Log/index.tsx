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
  Tag,
  Text,
  useToast,
  useColorModeValue
} from "@chakra-ui/react";
import { FaCheck } from "react-icons/fa";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TitlePage from "../../../components/TitlePage";
import { GroceryList } from "../../../contexts/GroceryListContext";
import { ProductsList } from "../../../contexts/ProductListContext";
import api from "../../../services/api";
import {
  itemAnimation,
  MotionBox,
} from "../../../components/Styles/motion-animate/animate";
import { parseCookies } from "nookies";

export interface Logs {
  created: string;
  description: string;
}

export function GroceryListLog() {
  const { groceryListId } = useParams();
  const [groceryList, setGroceryList] = useState<GroceryList[]>([]);
  const [productList, setProductList] = useState<ProductsList[]>([]);
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
      .post("/groceryList/getOne", { id: groceryListId, owner: id })
      .then((response) => {
        if (response.data.length === 0) {
          navigate("/*");
        }
        console.log(response.data);
        res = response.data;
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        if (res[0] && res[0].status !== "Cancelado") {
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

  const handlerFinished = () => {
    api
      .post("groceryList/changeStatus", {
        id: groceryListId,
        status: "finished",
      })
      .then((response: { data: any }) => {
        toast({
          title: "Lista de compras finalizada com sucesso",
          description: "Lista de compras foi finalizada com sucesso",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        navigate("/groceryList/all");
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro ao finalizar lista de compras",
          description: "Revise as informações e tente novamente",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const getTotalPrice = (paid?: string) => {
    if (paid) {
      return productList
        .filter((product) => product.paid === 1)
        .reduce((acc, product) => {
          return acc + parseFloat(product.price) * product.amount;
        }, 0);
    } else {
      return productList.reduce((acc, product) => {
        return acc + parseFloat(product.price) * product.amount;
      }, 0);
    }
  };

  return (
    <>
      <MotionBox variants={itemAnimation} margin="0 auto" padding={"2rem"}>
        <TitlePage title={"Andamento da lista de compra"} />

        {isLoading && groceryList.length > 0 && productList.length > 0 ? (
          <Box>
            <Tag fontSize="20px" p="2">
              {groceryList[0].status}
            </Tag>
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
                <Flex justifyContent={"space-between"}>
                  <Button
                    onClick={() => {
                      navigate("/institutions/all");
                    }}
                    cursor={"pointer"}
                    borderColor="200"
                    border="1px solid"
                    borderRadius={"6px"}
                    p={"6px"}
                    w="fit-content"
                  >
                    {groceryList[0].username}
                  </Button>
                  <Button
                    onClick={() => {
                      navigate("/partners/all");
                    }}
                    cursor={"pointer"}
                    display={"block"}
                    color={"green"}
                    borderColor="200"
                    border="1px solid"
                    borderRadius={"6px"}
                    p={"0px 6px"}
                    w="fit-content"
                  >
                    <Text>{groceryList[0].partner}</Text>
                    <Text
                      fontSize={"10px"}
                      color="black"
                      textAlign={"center"}
                      fontWeight={"800"}
                    >
                      Parceiro
                    </Text>
                  </Button>
                </Flex>
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
            <Grid templateColumns="repeat(11, 2fr)" gap={1}>
              <GridItem colSpan={5} w="100%">
                <Text textAlign={"center"} mb="10px">
                  Itens já pagos
                </Text>
                <Grid templateColumns="repeat(1, 1fr)" gap={3}>
                  {productList
                    .filter((product) => product.paid === 1)
                    .map((product) => (
                      <GridItem key={product.id}>
                        <Flex
                          minH={"120px"}
                          borderColor={"grey"}
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
                              height="120px"
                              objectFit="cover"
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
                          <Box
                            mr="2"
                            display={"inline-flex"}
                            alignItems={"center"}
                          >
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
              </GridItem>
              <GridItem
                display="flex"
                colSpan={1}
                gap={10}
                justifyContent={"center"}
              >
                <Divider
                  orientation="vertical"
                  borderWidth={"3px"}
                  w="fit-content"
                  borderColor="black"
                />
              </GridItem>
              <GridItem colSpan={5} w="100%">
                <Text textAlign={"center"} mb="10px">
                  Itens pendentes
                </Text>
                <Grid templateColumns="repeat(1, 1fr)" gap={3}>
                  {productList
                    .filter((product) => product.paid !== 1)
                    .map((product) => (
                      <GridItem key={product.id}>
                        <Flex
                          minH={"120px"}
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
                              height="120px"
                              objectFit="cover"
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
                          <Box
                            mr="2"
                            display={"inline-flex"}
                            alignItems={"center"}
                          >
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
              </GridItem>
            </Grid>
            {groceryList[0].status === "Finalizado" ? (
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
            ) : (
              <></>
            )}
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
              {groceryList[0].status === "Pendente" ? (
                <Box
                  bg={useColorModeValue( "white", "205d8b")}
                  mr="4"
                  border="1px black solid"
                  p="2px 9px"
                  borderRadius={"5px"}
                >
                  Lista de compras pendente
                </Box>
              ) : groceryList[0].status === "Em andamento" ? (
                <Box
                  bg={useColorModeValue( "white", "205d8b")}
                  mr="4"
                  border="1px black solid"
                  p="2px 9px"
                  borderRadius={"5px"}
                >
                  Total já pago: R${getTotalPrice("paid").toFixed(2)}
                </Box>
              ) : groceryList[0].status === "Esperando entrega" ? (
                <Button
                  colorScheme={"facebook"}
                  mr="4"
                  onClick={handlerFinished}
                >
                  Confirmar pedido recebido
                </Button>
              ) : (
                <Box
                  bg={useColorModeValue( "white", "205d8b")}
                  mr="4"
                  border="1px black solid"
                  p="2px 9px"
                  borderRadius={"5px"}
                >
                  Lista de compras finalizada!
                </Box>
              )}
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
      </MotionBox>
    </>
  );
}
